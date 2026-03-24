/**
 * Groups array elements by a key returned from a callback function.
 * @param {Array} arr - The array to group
 * @param {Function} fn - Callback that returns the group key
 * @returns {Object} Grouped object
 */
function groupBy(arr, fn) {
  if (!Array.isArray(arr)) {
    throw new TypeError('groupBy expects an array as first argument');
  }
  return arr.reduce((acc, item) => {
    const key = fn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

/**
 * Splits an array into chunks of the specified size.
 * @param {Array} arr - The array to chunk
 * @param {number} size - The chunk size
 * @returns {Array[]} Array of chunks
 */
function chunk(arr, size) {
  if (!Array.isArray(arr)) {
    throw new TypeError('chunk expects an array as first argument');
  }
  if (typeof size !== 'number' || size < 1) {
    throw new TypeError('chunk expects a positive number as second argument');
  }
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Recursively flattens nested arrays into a single-level array.
 * @param {Array} arr - The nested array to flatten
 * @returns {Array} Flattened array
 */
function flatten(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('flatten expects an array as argument');
  }
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

/**
 * Creates a debounced version of a function.
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

module.exports = { groupBy, chunk, flatten, debounce };
