const { clamp } = require('../src/utils/clamp');

describe('clamp', () => {
  test('returns value when in range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test('clamps to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('throws when min > max', () => {
    expect(() => clamp(5, 10, 0)).toThrow(RangeError);
  });

  // This test will FAIL intentionally
  test('handles NaN input', () => {
    expect(clamp(NaN, 0, 10)).toBe(0);
  });
});
