const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_carbon_key_123456', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
