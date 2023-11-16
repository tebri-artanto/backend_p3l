const httpStatus = require("http-status");
const Response = require("../Model/Response");

const calculateDays = async (req, res) => {
    try {
        // Extract check-in and check-out dates from the request body
        const { tanggalCekin, tanggalCheckout } = req.body;

        // Convert string dates to Date objects
        const checkinDate = new Date(tanggalCekin);
        const checkoutDate = new Date(tanggalCheckout);

        // Calculate the difference in milliseconds
        const timeDifference = checkoutDate - checkinDate;

        // Calculate the number of days
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        // Send the result as a response
        const response = new Response.Success(false, "Results found", daysDifference);
        res.status(httpStatus.OK).json(response);
    } catch (error) {
        console.error('Error calculating days:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const multiply = async (num1, num2) => {
    return num1 * num2;
};


module.exports = {
    calculateDays,
    multiply
  };

