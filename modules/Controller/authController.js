const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const Response = require("../Model/Response");
// const User = require("../Model/User");
const userValidator = require("../Utils/UserValidator");
const logInValidator = require("../Utils/logInValidator");
const bcrypt = require("../Utils/bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getAkun(req, res) {
  try {
    const akun = await prisma.akun.findMany();
    const response = new Response.Success(false, "Success", akun);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
}
// const getUserFromToken = (req, res) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.KEY);
//     const user = decoded;
//     res.json({ user });
//   } catch (error) {
//     res.status(401).json({ message: 'Token is invalid' });
//   }
// };

// async function getAkunById(req, res) {
//   try {
//     const { id } = req.params;
//     const akun = await prisma.akun.findUnique({
//       where: {
//         id: parseInt(id),
//       },
//     });
//     if (!akun) {
//       const response = new Response.Error(true, "Account not found");
//       return res.status(httpStatus.NOT_FOUND).json(response);
//     }
//     const response = new Response.Success(false, "Success", akun);
//     res.status(httpStatus.OK).json(response);
//   } catch (error) {
//     const response = new Response.Error(true, error.message);
//     res.status(httpStatus.BAD_REQUEST).json(response);
//   }
// }

async function signUp(req, res) {
  try {
    const request = await userValidator.validateAsync(req.body);
    const existingUser = await prisma.akun.findFirst({
      where: {
        OR: [
          { username: request.username },
        ],
      },
    });

    if (existingUser) {
      const response = new Response.Error(true, "Username already exists");
      return res.status(httpStatus.BAD_REQUEST).json(response);
    }
    const hashedPassword = await bcrypt.hash(request.password, 10);
    const user = await prisma.akun.create({
      data: {
        username: request.username,
        password: hashedPassword,
      },
    });

    const response = new Response.Success(false, "Signup Success", user);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
}

const logIn = async (req, res) => {
  try {
    const request = req.body;

    // Find the user by email
    const user = await prisma.akun.findFirst({
      where: {
        username: request.username,
      },
    });
    console.log(user);

    if (!user) {
      const response = new Response.Error(true, "Invalid Username");
      return res.status(httpStatus.BAD_REQUEST).json(response);
    }

    // Verify the password
    const isValidPassword = await bcrypt.compare(request.password, user.password);

    if (!isValidPassword) {
      const response = new Response.Error(true, "Invalid Password");
      return res.status(httpStatus.BAD_REQUEST).json(response);
    }

    // Create a JWT token
    const createJwtToken = jwt.sign(user, process.env.KEY, { expiresIn: '1h' } ); // Replace with your secret key
    const data = { token: createJwtToken, id: user.id };
    const response = new Response.Success(false, "Login Success", data);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};




const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldpassword, newpassword } = req.body;

    // Find the user by id
    const user = await prisma.akun.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      const response = new Response.Error(true, "User not found");
      return res.status(httpStatus.NOT_FOUND).json(response);
    }

    // Verify the old password
    const isValidPassword = await bcrypt.compare(oldpassword, user.password);

    if (!isValidPassword) {
      const response = new Response.Error(true, "Invalid old password");
      return res.status(httpStatus.BAD_REQUEST).json(response);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newpassword);

    // Update the password
    await prisma.akun.update({
      where: {
        id: parseInt(id),
      },
      data: {
        password: hashedPassword,
      },
    });

    const response = new Response.Success(false, "Password updated successfully");
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getUserFromToken = async (token) => {
  try {
    console.log(token);
    const decodedToken = jwt.verify(token, process.env.KEY); 
    console.log(decodedToken)// Replace with your secret key
    return decodedToken.id;

  } catch (error) {
    console.log(error);
    throw new Error("Invalid token");
    
  }
};

// Example route that uses the function
const getAkunByToken = async (req, res) => {
  const tokenLama = req.headers.authorization;
  const parts = tokenLama.split(' ');

// Check if the string contains 'Bearer' and extract the token
if (parts.length === 2 && parts[0] === 'Bearer') {
  const token = parts[1];
  console.log(token);
  if (!token) {
    const response = new Response.Error(true, "No token provided");
    return res.status(httpStatus.UNAUTHORIZED).json(response);
  }

  try {
    const userId = await getUserFromToken(token);

    const akun = await prisma.akun.findUnique({
      where: {
        id: userId,
      },
    });

    if (!akun) {
      const response = new Response.Error(true, "User not found");
      return res.status(httpStatus.NOT_FOUND).json(response);
    }

    const response = new Response.Success(false, "Success", akun);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
} else {
  console.log('Invalid authorization header');
}
  
};

const logout= async (req, res) =>  {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.KEY);
    const userId = decoded.id;
    // Here you can add any additional logic you need to perform before logging out the user
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getAkun, signUp, logIn, updatePassword, getAkunByToken, getUserFromToken, logout };
