const mongoose = require('mongoose');

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
    console.warn('[MongoDB] MONGO_URI is not set in Environment Variables.');
    return null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongooseInstance) => {
      console.log(`[MongoDB] Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('[MongoDB Error]:', e.message);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
