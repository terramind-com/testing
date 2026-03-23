const { greet } = require('./greeting');

describe('greet', () => {
  test('returns a personalized greeting for a valid name', () => {
    expect(greet('Alice')).toBe('Hello, Alice!');
    expect(greet('Bob')).toBe('Hello, Bob!');
  });

  test('throws an error when name is not provided', () => {
    expect(() => greet()).toThrow('Name is required and must be a string');
    expect(() => greet(null)).toThrow('Name is required and must be a string');
    expect(() => greet('')).toThrow('Name is required and must be a string');
  });

  test('throws an error when name is not a string', () => {
    expect(() => greet(123)).toThrow('Name is required and must be a string');
    expect(() => greet({})).toThrow('Name is required and must be a string');
  });
});
