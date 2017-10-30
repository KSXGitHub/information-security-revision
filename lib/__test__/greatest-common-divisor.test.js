'use strict'
const {RangeIterable, ProductIterable} = require('x-iterable')
const gcd = require('../greatest-common-divisor')
const {range} = RangeIterable
const {pow} = ProductIterable
const strfn = (a, b) => `gcd(${a}, ${b})`

function simpleGcd (a, b) {
  if (a === 0) return b
  if (b === 0) return a
  if (a < b) return simpleGcd(b, a)
  return range(a).map(x => a - x).find(x => !(a % x || b % x))
}

describe('Valid use-cases', () => pow(range(16), 2)
  .filter(([a, b]) => a !== 0 || b !== 0)
  .forEach(([a, b]) => describe(strfn(a, b), () => {
    const received = gcd(a, b)
    test(`${a} ≡ 0 mod ${strfn(a, b)}`, () => expect(a % received).toBe(0))
    test(`${b} ≡ 0 mod ${strfn(a, b)}`, () => expect(b % received).toBe(0))

    const expected = simpleGcd(a, b)
    test(`${strfn(a, b)} === ${expected}`, () => expect(received).toBe(expected))
  }))
)

describe(
  'Invalid use-cases',
  () => pow([undefined, {}, () => {}, Infinity, NaN], 2)
    .forEach(([a, b]) => describe(
      strfn(a, b),
      () => expect(() => gcd(a, b)).toThrow())
    )
)
