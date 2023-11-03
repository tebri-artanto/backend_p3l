const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const Response = require('../Model/Response');

const authenticateMiddleware = (req, res, next) => {
  // Extract the token from the request header
  const token = req.headers.authorization;

  // Check if a token is provided
  if (!token) {
    const response = new Response.Error(true, 'No token provided');
    return res.status(httpStatus.UNAUTHORIZED).json(response);
  }

  try {
    // Verify and decode the token using your secret key
    const decoded = jwt.verify(token, process.env.KEY); // Replace with your secret key

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    const response = new Response.Error(true, 'Token is invalid');
    return res.status(httpStatus.UNAUTHORIZED).json(response);
  }
};

module.exports = authenticateMiddleware;
