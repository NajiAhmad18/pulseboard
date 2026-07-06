const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
    weekEndDate: {
      type: Date,
      required: true,
    },
    tasksCompleted: {
      type: String,
      required: true,
    },
    tasksPlanned: {
      type: String,
      required: true,
    },
    blockers: {
      type: String,
      default: '',
    },
    hoursWorked: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'submitted'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
