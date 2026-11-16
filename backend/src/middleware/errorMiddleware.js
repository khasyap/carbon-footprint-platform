const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  if (err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
    message = 'Database query timed out. Please check that MONGO_URI is configured in Vercel and that MongoDB Atlas allows connections from anywhere (0.0.0.0/0).';
  }
  res.status(statusCode);
  res.json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
