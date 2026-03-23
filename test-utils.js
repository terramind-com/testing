const { capitalize } = require('./utils');

function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
  } catch (err) {
    console.error(`✗ ${description}`);
    console.error(`  Error: ${err.message}`);
    process.exit(1);
  }
}

function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error(`Expected "${expected}" but got "${actual}"`);
  }
}

// Run tests
test('capitalizes first letter of a word', () => {
  assertEqual(capitalize('hello'), 'Hello');
});

test('capitalizes first letter of each word', () => {
  assertEqual(capitalize('hello world'), 'Hello World');
});

test('handles already capitalized words', () => {
  assertEqual(capitalize('HELLO WORLD'), 'Hello World');
});

test('handles empty string', () => {
  assertEqual(capitalize(''), '');
});

test('handles null', () => {
  assertEqual(capitalize(null), '');
});

test('handles undefined', () => {
  assertEqual(capitalize(undefined), '');
});

test('handles special characters', () => {
  assertEqual(capitalize('hello @world #test'), 'Hello @world #test');
});

test('handles numbers in string', () => {
  assertEqual(capitalize('hello 123 world'), 'Hello 123 World');
});

test('handles multiple spaces', () => {
  assertEqual(capitalize('hello   world'), 'Hello World');
});

test('handles leading/trailing spaces', () => {
  assertEqual(capitalize('  hello world  '), '  Hello World  ');
});

test('handles mixed case', () => {
  assertEqual(capitalize('hElLo WoRlD'), 'Hello World');
});

test('handles single character', () => {
  assertEqual(capitalize('a'), 'A');
});

console.log('\nAll tests passed!');
