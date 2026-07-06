const dotenv = require('dotenv');
// Load env vars MUST be done before requiring local files
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect to database
connectDB();

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
