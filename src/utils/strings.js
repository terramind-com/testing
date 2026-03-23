/**
 * String utility functions
 */

/**
 * Checks if a given string is a palindrome.
 * Case-insensitive and ignores non-alphanumeric characters.
 *
 * @param {string} str - The string to check
 * @returns {boolean} - True if the string is a palindrome, false otherwise
 */
function isPalindrome(str) {
  if (typeof str !== 'string') {
    return false;
  }

  // Remove non-alphanumeric characters and convert to lowercase
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  // Check if the cleaned string equals its reverse
  return cleaned === cleaned.split('').reverse().join('');
}

module.exports = { isPalindrome };
