
function sanitizeInput(inputValue) {
  const sanitizedValue = inputValue.replace(/'/g, "''");
  return sanitizedValue;
}

module.exports = sanitizeInput;

  