const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API with key. Default to empty string if not provided
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

module.exports = genAI;
