const User = require('../models/User');
const AppError = require('../utils/AppError');

const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'member', // Force default to member for public registration
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password').populate('assignedProjects');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
