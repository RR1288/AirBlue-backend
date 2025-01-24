//Simple Integer test for Jest

const isInteger = require('./integer');

test('Checks to see if a number is an intger', () =>{
    expect(isInteger(23)).toBe(true);
    expect(isInteger(78.5)).toBe(false);
    expect(isInteger(120322)).toBe(true);
});