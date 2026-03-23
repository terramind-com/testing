/**
 * Capitalizes the first letter of each word in a string.
 * Handles edge cases like empty strings and special characters.
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalize(str) {
  if (str === null || str === undefined) {
    return '';
  }

  const stringified = String(str);

  if (stringified.length === 0) {
    return '';
  }

  return stringified
    .split(/\s+/)
    .map(word => {
      if (word.length === 0) {
        return word;
      }
      const firstChar = word.charAt(0);
      const rest = word.slice(1);
      return firstChar.toUpperCase() + rest.toLowerCase();
    })
    .join(' ');
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { capitalize };
}
