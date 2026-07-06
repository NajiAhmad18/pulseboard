const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // Only admins can see overall analytics

router.get('/dashboard', analyticsController.getDashboardAnalytics);

module.exports = router;
