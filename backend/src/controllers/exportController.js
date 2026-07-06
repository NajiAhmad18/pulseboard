const exportService = require('../services/exportService');
const AppError = require('../utils/AppError');

const exportReports = async (req, res, next) => {
  try {
    const { format, scope, filters, selectedReportIds } = req.body;

    if (!format || !['pdf', 'csv'].includes(format)) {
      return next(new AppError('Invalid or missing export format. Use "pdf" or "csv".', 400));
    }

    // Call service to generate file
    const result = await exportService.generateExport({
      format,
      scope,
      filters,
      selectedReportIds
    });

    if (result.empty) {
      return res.status(204).json({ message: 'No reports found for the selected filters.' });
    }

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=pulseboard-reports.csv');
      return res.send(result.data);
    } else if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=pulseboard-reports.pdf');
      // result.data is a stream or buffer. For pdfmake, we often get a buffer or stream.
      return res.send(result.data);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportReports
};
