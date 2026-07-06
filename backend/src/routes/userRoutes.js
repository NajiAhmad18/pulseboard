const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // Only admin can access users list

router.get('/', userController.getAllUsers);

module.exports = router;
