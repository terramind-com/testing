/**
 * Creates a memoized version of a function that caches results
 * based on the arguments provided.
 * 
 * @param {Function} fn - The function to memoize
 * @param {Object} options - Configuration
 * @param {number} options.maxSize - Max cache entries (default: 100)
 * @param {Function} options.keyFn - Custom cache key generator
 * @returns {Function} Memoized function with .cache and .clear()
 */
function memoize(fn, options = {}) {
  const { maxSize = 100, keyFn } = options;
  const cache = new Map();

  function memoized(...args) {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    
    // Evict oldest entry if at capacity
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  }

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

module.exports = { memoize };
