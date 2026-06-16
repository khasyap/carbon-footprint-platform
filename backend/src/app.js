const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Carbon Footprint Platform API is running...' });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const carbonRoutes = require('./routes/carbonRoutes');
const goalRoutes = require('./routes/goalRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
