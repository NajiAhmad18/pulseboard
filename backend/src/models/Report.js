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
      required: [true, 'Tasks completed is required'],
      minlength: [10, 'Please provide more detail (at least 10 characters)'],
      maxlength: [2000, 'Tasks completed cannot exceed 2000 characters'],
      trim: true
    },
    tasksPlanned: {
      type: String,
      required: [true, 'Tasks planned is required'],
      maxlength: [2000, 'Tasks planned cannot exceed 2000 characters'],
      trim: true
    },
    blockers: {
      type: String,
      default: '',
      maxlength: [1000, 'Blockers cannot exceed 1000 characters'],
      trim: true
    },
    hoursWorked: {
      type: Number,
      default: 0,
      min: [0, 'Hours worked cannot be negative'],
      max: [80, 'Hours worked cannot exceed 80 per week']
    },
    notes: {
      type: String,
      default: '',
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      trim: true
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
