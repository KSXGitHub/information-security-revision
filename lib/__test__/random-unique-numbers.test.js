'use strict'
const RangeIterable = require('range-iterable')
const randomUniqueNumbers = require('../random-unique-numbers')
const testUniquity = require('./lib/test-uniquity')
expect.extend(require('jest-tobetype'))

describe('randomUniqueNumbers(length)', () => describe(
  'should contain only integers in range [0; length)',
  () => RangeIterable.range(5).map(x => 1 << x).forEach(length => {
    const array = randomUniqueNumbers(length)
    describe(`length = ${length}, array = [${array.join(', ')}]`, () => {
      array.forEach((x, i) => test(`i = ${i}, x = ${x}`, () => {
        expect(x).toBeType('number')
        expect(x).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThan(length)
        expect(x % 1).toBe(0)
      }))
    })
  })
))

describe(
  'should not contain any duplicate element',
  () => RangeIterable.range(5).map(x => 1 << x).forEach(length => {
    const array = randomUniqueNumbers(length)
    test(`length = ${length}, array = [${array.join(', ')}]`, testUniquity(array))
  })
)
