const Project = require('../models/Project');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/responseHandler');

const getAllProjects = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { isActive: true };
    const projects = await Project.find(query).sort({ name: 1 });
    sendResponse(res, 200, 'Projects retrieved', projects);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description });
    sendResponse(res, 201, 'Project created', project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) throw new AppError('Project not found', 404);
    sendResponse(res, 200, 'Project updated', project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new AppError('Project not found', 404);
    
    project.isActive = false;
    await project.save();
    
    sendResponse(res, 200, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject
};
