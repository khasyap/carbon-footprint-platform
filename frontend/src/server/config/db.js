const mongoose = require('mongoose');

// Disable buffering commands so queries fail immediately with clear errors if DB is not connected
mongoose.set('bufferCommands', false);

let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    const errorMsg = 'Database connection error: MONGO_URI environment variable is missing. ' +
      'Please add MONGO_URI in your Vercel Project Settings > Environment Variables (e.g., from MongoDB Atlas).';
    console.error(`[MongoDB Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  if (process.env.NODE_ENV === 'production' && (uri.includes('127.0.0.1') || uri.includes('localhost'))) {
    const errorMsg = 'Database connection error: MONGO_URI cannot use localhost (127.0.0.1) in production. ' +
      'Please use a cloud-hosted database URI like MongoDB Atlas (mongodb+srv://...) in your Vercel Environment Variables.';
    console.error(`[MongoDB Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of hanging 30s
      connectTimeoutMS: 5000,
      socketTimeoutMS: 20000,
      maxPoolSize: 10,
    };
    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`[MongoDB] Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error('[MongoDB Error]:', e.message);
    throw new Error(
      `Database connection failed: ${e.message}. ` +
      `If using MongoDB Atlas, make sure Network Access allows '0.0.0.0/0' (Allow access from anywhere).`
    );
  }

  return cached.conn;
};

module.exports = connectDB;
