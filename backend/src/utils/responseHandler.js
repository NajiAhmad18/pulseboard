const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    status: `${statusCode}`.startsWith('4') || `${statusCode}`.startsWith('5') ? 'error' : 'success',
    message,
    data,
  });
};

module.exports = sendResponse;
