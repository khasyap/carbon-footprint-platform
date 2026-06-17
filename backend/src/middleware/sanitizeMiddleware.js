/**
 * Sanitizes request inputs by escaping HTML characters (prevent XSS)
 * and stripping keys starting with '$' (prevent MongoDB operator injection).
 */
const sanitizeInput = (req, res, next) => {
  const sanitizeValue = (val) => {
    if (typeof val === 'string') {
      // Escape HTML characters
      return val
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
    if (typeof val === 'object' && val !== null) {
      const isArray = Array.isArray(val);
      const cleanObj = isArray ? [] : {};
      
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key)) {
          // If a key starts with $, it is a MongoDB operator injection attempt. Strip it.
          if (typeof key === 'string' && key.startsWith('$')) {
            continue;
          }
          const sanitizedVal = sanitizeValue(val[key]);
          if (isArray) {
            cleanObj.push(sanitizedVal);
          } else {
            cleanObj[key] = sanitizedVal;
          }
        }
      }
      return cleanObj;
    }
    return val;
  };

  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);

  next();
};

module.exports = sanitizeInput;
