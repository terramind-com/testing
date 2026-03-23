/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param {string} str - The input string to capitalize
 * @returns {string} - The capitalized string, or empty string if input is empty/null
 */
function capitalizeWords(str) {
  // Handle edge cases: empty string, null, undefined, or single character
  if (!str || str.length === 0) {
    return '';
  }

  return str
    .split(' ')
    .map(word => {
      if (word.length === 0) {
        return '';
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

module.exports = { capitalizeWords };
