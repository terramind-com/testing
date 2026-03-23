/**
 * Tests for string utility functions
 */

const { isPalindrome } = require('./strings');

describe('isPalindrome', () => {
  test('returns true for simple palindromes', () => {
    expect(isPalindrome('racecar')).toBe(true);
    expect(isPalindrome('madam')).toBe(true);
    expect(isPalindrome('level')).toBe(true);
  });

  test('returns false for non-palindromes', () => {
    expect(isPalindrome('hello')).toBe(false);
    expect(isPalindrome('world')).toBe(false);
    expect(isPalindrome('javascript')).toBe(false);
  });

  test('is case-insensitive', () => {
    expect(isPalindrome('Racecar')).toBe(true);
    expect(isPalindrome('Madam')).toBe(true);
    expect(isPalindrome('LeVel')).toBe(true);
  });

  test('ignores non-alphanumeric characters', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
    expect(isPalindrome('race a car')).toBe(false);
    expect(isPalindrome('Was it a car or a cat I saw?')).toBe(true);
  });

  test('handles empty string', () => {
    expect(isPalindrome('')).toBe(true);
  });

  test('handles single character', () => {
    expect(isPalindrome('a')).toBe(true);
    expect(isPalindrome('5')).toBe(true);
  });

  test('handles non-string inputs', () => {
    expect(isPalindrome(null)).toBe(false);
    expect(isPalindrome(undefined)).toBe(false);
    expect(isPalindrome(123)).toBe(false);
    expect(isPalindrome({})).toBe(false);
    expect(isPalindrome([])).toBe(false);
  });
});
