const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

// Validation Rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);

module.exports = router;
