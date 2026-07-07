const reportService = require('../services/reportService');
const sendResponse = require('../utils/responseHandler');

const createReport = async (req, res, next) => {
  try {
    const report = await reportService.createReport(req.user._id, req.body);
    sendResponse(res, 201, 'Report created successfully', report);
  } catch (error) {
    next(error);
  }
};

const getMyReports = async (req, res, next) => {
  try {
    const reports = await reportService.getMyReports(req.user._id, req.query);
    sendResponse(res, 200, 'Reports retrieved successfully', reports);
  } catch (error) {
    next(error);
  }
};

const getAllReports = async (req, res, next) => {
  try {
    const result = await reportService.getAllReports(req.query);
    // result = { data, total, page, totalPages }
    res.status(200).json({
      success: true,
      message: 'All reports retrieved successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminReportById = async (req, res, next) => {
  try {
    const report = await reportService.getAdminReportById(req.params.id);
    sendResponse(res, 200, 'Report retrieved successfully', report);
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await reportService.getReportById(req.params.id, req.user._id);
    sendResponse(res, 200, 'Report retrieved successfully', report);
  } catch (error) {
    next(error);
  }
};

const updateReport = async (req, res, next) => {
  try {
    const report = await reportService.updateReport(req.params.id, req.user._id, req.body);
    sendResponse(res, 200, 'Report updated successfully', report);
  } catch (error) {
    next(error);
  }
};

const submitReport = async (req, res, next) => {
  try {
    const report = await reportService.submitReport(req.params.id, req.user._id);
    sendResponse(res, 200, 'Report submitted successfully', report);
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    await reportService.deleteDraftReport(req.params.id, req.user._id);
    sendResponse(res, 200, 'Draft report deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getMyReports,
  getAllReports,
  getAdminReportById,
  getReportById,
  updateReport,
  submitReport,
  deleteReport
};
