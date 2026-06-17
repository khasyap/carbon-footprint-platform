const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sanitizeInput = require('./middleware/sanitizeMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Rate Limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 login/register requests per windowMs
  message: { success: false, message: 'Too many authentication attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(sanitizeInput);

// Apply rate limiters
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

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
