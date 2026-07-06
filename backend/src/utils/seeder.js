const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config({ path: '.env' });

const seedAdmin = async () => {
  try {
    // If not connected, connect
    if (mongoose.connection.readyState !== 1) {
       await connectDB();
    }
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    console.log('Admin user seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error}`);
    process.exit(1);
  }
};

seedAdmin();
