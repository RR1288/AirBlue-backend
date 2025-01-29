//Simple Interger test for Jest

const isInteger = require('./integer');

test('Checks to see if a number is an integer', () => {
    expect(isInteger(10)).toBe(true);
    expect(isInteger(34.5)).toBe(false);
    expect(isInteger(123)).toBe(true);
});