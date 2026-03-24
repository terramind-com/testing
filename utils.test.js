const { flattenArray } = require('./utils');

const testCases = [
  {
    input: [[1, 2], [3, [4, 5]]],
    expected: [1, 2, 3, 4, 5],
  },
  {
    input: [1, [2, [3, [4]]], 5],
    expected: [1, 2, 3, 4, 5],
  },
  {
    input: [],
    expected: [],
  },
  {
    input: [[['a']], ['b', ['c']]],
    expected: ['a', 'b', 'c'],
  },
];

for (const { input, expected } of testCases) {
  const actual = flattenArray(input);

  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `flattenArray(${JSON.stringify(input)}) returned ${JSON.stringify(actual)} instead of ${JSON.stringify(expected)}`
    );
  }
}

console.log('flattenArray tests passed');
