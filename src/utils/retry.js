async function retry(fn, options = {}) {
  const { maxRetries = 3, delay = 100 } = options;

  let attempt = 0;
  let currentDelay = delay;
  let lastError;

  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= 2;
      attempt += 1;
    }
  }

  throw lastError;
}

module.exports = retry;
