function debounce(callback, wait) {
  let timeoutId = null;

  function debounced(...args) {
    const context = this;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(function () {
      timeoutId = null;
      callback.apply(context, args);
    }, wait);
  }

  debounced.cancel = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

module.exports = debounce;
