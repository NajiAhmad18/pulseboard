const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      unique: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [80, 'Project name cannot exceed 80 characters'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
