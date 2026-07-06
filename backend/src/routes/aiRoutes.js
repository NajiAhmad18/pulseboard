const express = require('express');
const aiController = require('../controllers/aiController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // Only admins can use the AI assistant for team reports

router.post('/ask', aiController.askAi);

module.exports = router;
