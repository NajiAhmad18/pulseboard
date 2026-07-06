const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
})); // Allow frontend to send cookies
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
