const express = require('express');
const { body } = require('express-validator');
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(protect); // All routes require authentication

// Validation rules
const reportValidation = [
  body('projectId').isMongoId().withMessage('Valid Project ID is required'),
  body('weekStartDate').isISO8601().withMessage('Valid start date is required'),
  body('weekEndDate').isISO8601().withMessage('Valid end date is required'),
  body('tasksCompleted').notEmpty().withMessage('Tasks completed field is required'),
  body('tasksPlanned').notEmpty().withMessage('Tasks planned field is required'),
  body('hoursWorked').optional().isNumeric().withMessage('Hours worked must be a number'),
];

// Admin route
router.get('/all', authorize('admin'), reportController.getAllReports);
router.get('/all/:id', authorize('admin'), reportController.getAdminReportById);

router.route('/')
  .post(reportValidation, validate, reportController.createReport)
  .get(reportController.getMyReports);

router.route('/:id')
  .get(reportController.getReportById)
  .put(reportValidation, validate, reportController.updateReport)
  .delete(reportController.deleteReport);

router.post('/:id/submit', reportController.submitReport);

module.exports = router;
