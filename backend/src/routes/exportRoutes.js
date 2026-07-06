const express = require('express');
const { exportReports } = require('../controllers/exportController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Only admin can export reports
router.post('/', protect, authorize('admin'), exportReports);

module.exports = router;
