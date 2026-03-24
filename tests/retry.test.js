const test = require('node:test');
const assert = require('node:assert/strict');

const retry = require('../src/utils/retry');

test('returns the result on the first successful attempt', async () => {
  let attempts = 0;

  const result = await retry(async () => {
    attempts += 1;
    return 'success';
  });

  assert.equal(result, 'success');
  assert.equal(attempts, 1);
});

test('throws the last error after exhausting retries', async () => {
  let attempts = 0;
  const error = new Error('always fails');

  await assert.rejects(
    retry(async () => {
      attempts += 1;
      throw error;
    }, { maxRetries: 2, delay: 1 }),
    error
  );

  assert.equal(attempts, 3);
});

test('retries failed attempts and eventually succeeds', async () => {
  let attempts = 0;

  const result = await retry(async () => {
    attempts += 1;

    if (attempts < 3) {
      throw new Error('temporary failure');
    }

    return 'eventual success';
  }, { maxRetries: 3, delay: 1 });

  assert.equal(result, 'eventual success');
  assert.equal(attempts, 3);
});
