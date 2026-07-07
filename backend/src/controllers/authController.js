const authService = require('../services/authService');
const generateToken = require('../utils/generateToken');
const sendResponse = require('../utils/responseHandler');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    generateToken(res, user._id);
    
    sendResponse(res, 201, 'User registered successfully', user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await authService.loginUser(email, password, role);
    generateToken(res, user._id);

    sendResponse(res, 200, 'Login successful', user);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  
  sendResponse(res, 200, 'Logged out successfully');
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    sendResponse(res, 200, 'User profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
