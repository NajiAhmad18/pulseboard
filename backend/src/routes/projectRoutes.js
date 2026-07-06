const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.use(protect);

// Public (to all authenticated users)
router.get('/', projectController.getAllProjects);

// Admin only
router.use(authorize('admin'));
router.post('/', projectController.createProject);
router.route('/:id')
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
