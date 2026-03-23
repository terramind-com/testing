function countWords(str) {
  const trimmed = str.trim();

  if (trimmed === '') {
    return 0;
  }

  return trimmed.split(/\s+/).length;
}

module.exports = countWords;
