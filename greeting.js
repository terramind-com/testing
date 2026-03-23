/**
 * Generates a personalized greeting for a given name.
 * @param {string} name - The name to greet
 * @returns {string} A personalized greeting string
 */
function greet(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required and must be a string');
  }
  return `Hello, ${name}!`;
}

module.exports = { greet };
