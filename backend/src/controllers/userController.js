const User = require('../models/User');
const sendResponse = require('../utils/responseHandler');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ name: 1 });
    sendResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
};
