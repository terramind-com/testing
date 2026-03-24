/**
 * Creates a throttled version of the given function that only invokes
 * the original function at most once per specified interval.
 * 
 * @param {Function} fn - The function to throttle
 * @param {number} interval - Minimum time between invocations in ms
 * @param {Object} options - Configuration options
 * @param {boolean} options.leading - Invoke on leading edge (default: true)
 * @param {boolean} options.trailing - Invoke on trailing edge (default: true)
 * @returns {Function} Throttled function with .cancel() method
 */
function throttle(fn, interval, options = {}) {
  const { leading = true, trailing = true } = options;
  let lastCallTime = 0;
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;

  function invoke() {
    lastCallTime = Date.now();
    fn.apply(lastThis, lastArgs);
    lastArgs = null;
    lastThis = null;
  }

  function throttled(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    lastArgs = args;
    lastThis = this;

    if (timeSinceLastCall >= interval) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (leading) {
        invoke();
      } else {
        lastCallTime = now;
        if (trailing) {
          timeoutId = setTimeout(invoke, interval);
        }
      }
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(invoke, interval - timeSinceLastCall);
    }
  }

  throttled.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
    lastCallTime = 0;
  };

  return throttled;
}

/**
 * Creates a debounced version of the given function.
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {boolean} immediate - Trigger on leading edge
 * @returns {Function} Debounced function with .cancel() and .flush() methods
 */
function debounce(fn, delay, immediate = false) {
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    
    if (timeoutId) clearTimeout(timeoutId);

    if (immediate && !timeoutId) {
      fn.apply(this, args);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        fn.apply(lastThis, lastArgs);
      }
    }, delay);
  }

  debounced.cancel = function () {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
  };

  debounced.flush = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      fn.apply(lastThis, lastArgs);
    }
  };

  return debounced;
}

module.exports = { throttle, debounce };
