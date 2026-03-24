function clamp(value, min, max) {
  if (min > max) throw new RangeError('min must be <= max');
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

module.exports = { clamp };
