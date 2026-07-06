const Report = require('../models/Report');
const { Parser } = require('json2csv');
const pdfmake = require('pdfmake');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const mongoose = require('mongoose');

// Helper to fetch data based on filters
const fetchReports = async (scope, filters, selectedReportIds) => {
  let query = {};

  if (scope === 'selected' && selectedReportIds && selectedReportIds.length > 0) {
    query._id = { $in: selectedReportIds };
  } else if (scope === 'filtered' || scope === 'all') { // if 'all', filters might be empty, but we apply whatever is passed just in case or ignore
    if (scope === 'filtered' && filters) {
      if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
      }
      if (filters.projectId) {
        query.projectId = filters.projectId;
      }
      if (filters.userId) {
        query.userId = filters.userId;
      }
      if (filters.startDate || filters.endDate) {
        query.weekStartDate = {};
        if (filters.startDate) query.weekStartDate.$gte = new Date(filters.startDate);
        if (filters.endDate) query.weekStartDate.$lte = new Date(filters.endDate);
      }
    }
  }

  const reports = await Report.find(query)
    .populate('userId', 'name email')
    .populate('projectId', 'name')
    .sort({ weekStartDate: -1, createdAt: -1 })
    .lean(); // Use lean for better performance since we just need the data

  return reports;
};

// Generate CSV
const generateCSV = (reports) => {
  const fields = [
    { label: 'Member Name', value: 'userId.name' },
    { label: 'Member Email', value: 'userId.email' },
    { label: 'Project', value: 'projectId.name' },
    { label: 'Week Start', value: (row) => new Date(row.weekStartDate).toLocaleDateString() },
    { label: 'Week End', value: (row) => new Date(row.weekEndDate).toLocaleDateString() },
    { label: 'Tasks Completed', value: 'tasksCompleted' },
    { label: 'Tasks Planned', value: 'tasksPlanned' },
    { label: 'Blockers', value: 'blockers' },
    { label: 'Hours Worked', value: 'hoursWorked' },
    { label: 'Notes', value: 'notes' },
    { label: 'Status', value: 'status' },
    { label: 'Created Date', value: (row) => new Date(row.createdAt).toLocaleDateString() },
    { label: 'Updated Date', value: (row) => new Date(row.updatedAt).toLocaleDateString() }
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(reports);
  return csv;
};

// Generate Chart Buffers
const generateCharts = async (reports) => {
  const width = 400;
  const height = 200;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  // Compute stats
  let draftCount = 0;
  let submittedCount = 0;
  let projectsMap = {};
  
  reports.forEach(r => {
    if (r.status === 'draft') draftCount++;
    if (r.status === 'submitted') submittedCount++;
    
    const projName = r.projectId?.name || 'Unknown';
    projectsMap[projName] = (projectsMap[projName] || 0) + 1;
  });

  const statusConfig = {
    type: 'pie',
    data: {
      labels: ['Draft', 'Submitted'],
      datasets: [{
        data: [draftCount, submittedCount],
        backgroundColor: ['#94a3b8', '#3b82f6'] // slate-400, blue-500
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: 'Submission Status' }
      }
    }
  };

  const projectLabels = Object.keys(projectsMap);
  const projectData = Object.values(projectsMap);

  const projectConfig = {
    type: 'bar',
    data: {
      labels: projectLabels.length ? projectLabels : ['None'],
      datasets: [{
        label: 'Reports',
        data: projectData.length ? projectData : [0],
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: 'Reports per Project' }
      }
    }
  };

  const statusChartBuffer = await chartJSNodeCanvas.renderToBuffer(statusConfig);
  const projectChartBuffer = await chartJSNodeCanvas.renderToBuffer(projectConfig);

  return { statusChartBuffer, projectChartBuffer, draftCount, submittedCount };
};

// Generate PDF
const generatePDF = async (reports) => {
  const fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    }
  };

  pdfmake.setFonts(fonts);

  const { statusChartBuffer, projectChartBuffer, draftCount, submittedCount } = await generateCharts(reports);
  
  const uniqueProjects = new Set(reports.map(r => r.projectId?._id?.toString())).size;
  const uniqueMembers = new Set(reports.map(r => r.userId?._id?.toString())).size;

  const docDefinition = {
    defaultStyle: {
      font: 'Helvetica'
    },
    content: [
      { text: 'PulseBoard', style: 'header' },
      { text: 'Weekly Reports Summary', style: 'subheader' },
      { text: `Generated: ${new Date().toLocaleString()}`, margin: [0, 0, 0, 20] },
      
      // Summary Cards
      {
        table: {
          widths: ['*', '*', '*', '*', '*'],
          body: [
            [
              { text: 'Total', bold: true, fillColor: '#f1f5f9' },
              { text: 'Submitted', bold: true, fillColor: '#f1f5f9' },
              { text: 'Draft', bold: true, fillColor: '#f1f5f9' },
              { text: 'Projects', bold: true, fillColor: '#f1f5f9' },
              { text: 'Members', bold: true, fillColor: '#f1f5f9' }
            ],
            [
              { text: reports.length.toString() },
              { text: submittedCount.toString() },
              { text: draftCount.toString() },
              { text: uniqueProjects.toString() },
              { text: uniqueMembers.toString() }
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 20]
      },

      // Charts
      {
        columns: [
          {
            image: statusChartBuffer,
            width: 250
          },
          {
            image: projectChartBuffer,
            width: 250
          }
        ],
        margin: [0, 0, 0, 30]
      },

      // Report Table
      { text: 'Report Details', style: 'subheader', margin: [0, 0, 0, 10] },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Member', bold: true, fillColor: '#1e293b', color: 'white' },
              { text: 'Project', bold: true, fillColor: '#1e293b', color: 'white' },
              { text: 'Week', bold: true, fillColor: '#1e293b', color: 'white' },
              { text: 'Hours', bold: true, fillColor: '#1e293b', color: 'white' },
              { text: 'Status', bold: true, fillColor: '#1e293b', color: 'white' },
              { text: 'Created', bold: true, fillColor: '#1e293b', color: 'white' }
            ],
            ...reports.map((r, index) => {
              const fillColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
              return [
                { text: r.userId?.name || 'N/A', fillColor },
                { text: r.projectId?.name || 'N/A', fillColor },
                { text: new Date(r.weekStartDate).toLocaleDateString(), fillColor },
                { text: r.hoursWorked?.toString() || '0', fillColor },
                { text: r.status, fillColor },
                { text: new Date(r.createdAt).toLocaleDateString(), fillColor }
              ];
            })
          ]
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex % 2 === 0) ? '#f8fafc' : null;
          }
        }
      }
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        color: '#1e293b',
        margin: [0, 0, 0, 5]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        color: '#475569',
        margin: [0, 0, 0, 5]
      }
    },
    footer: function(currentPage, pageCount) {
      return {
        columns: [
          { text: 'Generated by PulseBoard', margin: [40, 10, 0, 0], color: '#94a3b8', fontSize: 10 },
          { text: `Page ${currentPage.toString()} of ${pageCount}`, alignment: 'right', margin: [0, 10, 40, 0], color: '#94a3b8', fontSize: 10 }
        ]
      };
    }
  };

  try {
    const pdfDoc = pdfmake.createPdf(docDefinition);
    const buffer = await pdfDoc.getBuffer();
    return buffer;
  } catch (err) {
    throw err;
  }
};

const generateExport = async ({ format, scope, filters, selectedReportIds }) => {
  const reports = await fetchReports(scope, filters, selectedReportIds);

  if (!reports || reports.length === 0) {
    return { empty: true };
  }

  if (format === 'csv') {
    const data = generateCSV(reports);
    return { empty: false, data };
  } else if (format === 'pdf') {
    const data = await generatePDF(reports);
    return { empty: false, data };
  }
};

module.exports = {
  generateExport
};
