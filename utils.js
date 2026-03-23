function reverseWords(input) {
  return input.trim().split(/\s+/).reverse().join(' ');
}

module.exports = {
  reverseWords,
};
