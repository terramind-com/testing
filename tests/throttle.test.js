const { throttle, debounce } = require('../src/utils/throttle');

jest.useFakeTimers();

describe('throttle', () => {
  test('calls function immediately on first call (leading)', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);
    throttled('a');
    expect(fn).toHaveBeenCalledWith('a');
  });

  test('suppresses calls within interval', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('calls trailing after interval', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);
    throttled('first');
    throttled('second');
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('second');
  });

  test('cancel stops pending invocations', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);
    throttled();
    throttled();
    throttled.cancel();
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('debounce', () => {
  test('delays execution', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('resets timer on subsequent calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced();
    jest.advanceTimersByTime(50);
    debounced();
    jest.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('immediate mode calls on leading edge', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100, true);
    debounced();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('flush triggers pending call', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced('data');
    debounced.flush();
    expect(fn).toHaveBeenCalledWith('data');
  });
});
