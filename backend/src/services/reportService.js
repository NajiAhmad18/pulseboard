const Report = require('../models/Report');
const AppError = require('../utils/AppError');

const createReport = async (userId, reportData) => {
  if (new Date(reportData.weekEndDate) < new Date(reportData.weekStartDate)) {
    throw new AppError('Week end date cannot be before week start date', 400);
  }

  return await Report.create({
    ...reportData,
    userId,
  });
};

const getMyReports = async (userId) => {
  return await Report.find({ userId }).populate('projectId', 'name').sort({ weekStartDate: -1 });
};

const getAllReports = async (filters) => {
  const query = {};
  if (filters.userId) query.userId = filters.userId;
  if (filters.projectId) query.projectId = filters.projectId;
  if (filters.status) query.status = filters.status;
  if (filters.startDate && filters.endDate) {
    query.weekStartDate = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };
  }

  const page = Math.max(1, parseInt(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(filters.limit) || 10));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Report.find(query)
      .populate('projectId', 'name')
      .populate('userId', 'name email')
      .sort({ weekStartDate: -1 })
      .skip(skip)
      .limit(limit),
    Report.countDocuments(query),
  ]);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

const getAdminReportById = async (reportId) => {
  const report = await Report.findById(reportId)
    .populate('projectId', 'name')
    .populate('userId', 'name email');
    
  if (!report) {
    throw new AppError('Report not found', 404);
  }
  return report;
};

const getReportById = async (reportId, userId) => {
  const report = await Report.findOne({ _id: reportId, userId }).populate('projectId', 'name');
  if (!report) {
    throw new AppError('Report not found or not authorized', 404);
  }
  return report;
};

const updateReport = async (reportId, userId, updateData) => {
  const report = await getReportById(reportId, userId);

  if (report.status === 'submitted') {
    throw new AppError('Cannot edit a submitted report', 400);
  }

  // Prevent changing status directly through general update, must use submit logic
  if (updateData.status && updateData.status !== 'draft') {
     throw new AppError('Use submit endpoint to submit a report', 400);
  }

  if (updateData.weekStartDate && updateData.weekEndDate) {
    if (new Date(updateData.weekEndDate) < new Date(updateData.weekStartDate)) {
      throw new AppError('Week end date cannot be before week start date', 400);
    }
  }

  Object.assign(report, updateData);
  await report.save();
  return report;
};

const submitReport = async (reportId, userId) => {
  const report = await getReportById(reportId, userId);

  if (report.status === 'submitted') {
    throw new AppError('Report is already submitted', 400);
  }

  report.status = 'submitted';
  await report.save();
  return report;
};

const deleteDraftReport = async (reportId, userId) => {
  const report = await getReportById(reportId, userId);

  if (report.status === 'submitted') {
    throw new AppError('Cannot delete a submitted report', 400);
  }

  await report.deleteOne();
};

module.exports = {
  createReport,
  getMyReports,
  getAllReports,
  getAdminReportById,
  getReportById,
  updateReport,
  submitReport,
  deleteDraftReport
};
