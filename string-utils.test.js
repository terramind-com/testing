const { capitalizeWords } = require('./string-utils.js');

describe('capitalizeWords', () => {
  test('capitalizes first letter of each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
  });

  test('handles empty string', () => {
    expect(capitalizeWords('')).toBe('');
  });

  test('handles null', () => {
    expect(capitalizeWords(null)).toBe('');
  });

  test('handles undefined', () => {
    expect(capitalizeWords(undefined)).toBe('');
  });

  test('handles single character', () => {
    expect(capitalizeWords('a')).toBe('A');
  });

  test('handles multiple words', () => {
    expect(capitalizeWords('the quick brown fox')).toBe('The Quick Brown Fox');
  });

  test('handles already capitalized words', () => {
    expect(capitalizeWords('Hello World')).toBe('Hello World');
  });

  test('handles mixed case words', () => {
    expect(capitalizeWords('hELLO wORLD')).toBe('Hello World');
  });
});
