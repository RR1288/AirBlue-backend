// Helper function to send error responses
const sendError = (res, message, statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

// Helper function to send success responses
const sendSuccess = (res, message, data = null) => {
    res.status(200).json({
        success: true,
        message: message,
        data: data,
    });
};

module.exports = {
    sendError,
    sendSuccess,
};