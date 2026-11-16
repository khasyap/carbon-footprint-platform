const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// In unified fullstack deployment, Express listens internally on BACKEND_PORT.
// In standalone deployment (Render, Railway, etc.), Express binds to PORT.
const PORT = process.env.BACKEND_PORT || process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});
