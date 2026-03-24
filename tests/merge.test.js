const { deepMerge, shallowMerge } = require('../src/utils/merge');

describe('deepMerge', () => {
  test('merges flat objects', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  test('merges nested objects', () => {
    const result = deepMerge(
      { config: { host: 'localhost', port: 3000 } },
      { config: { port: 8080, debug: true } }
    );
    expect(result.config.host).toBe('localhost');
    expect(result.config.port).toBe(8080);
    expect(result.config.debug).toBe(true);
  });

  test('concatenates arrays', () => {
    const result = deepMerge({ tags: ['a'] }, { tags: ['b', 'c'] });
    expect(result.tags).toEqual(['a', 'b', 'c']);
  });

  test('handles null and undefined values', () => {
    expect(deepMerge({ a: 1 }, { a: null })).toEqual({ a: null });
    expect(deepMerge({ a: 1 }, { a: undefined })).toEqual({ a: undefined });
  });
});

describe('shallowMerge', () => {
  test('merges objects shallowly', () => {
    const result = shallowMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 } });
    expect(result.b).toEqual({ y: 2 });
  });
});
