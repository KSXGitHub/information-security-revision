'use strict'
const {RangeIterable, ProductIterable} = require('x-iterable')
const mkmul = require('../indian-multiply')
const mkring = require('../ring')
const {range} = RangeIterable
const {pow} = ProductIterable

range(2, 6).forEach(mod => describe(`mod = ${mod}`, () => {
  const ring = mkring(mod)
  const mul = mkmul(ring)

  pow(range(8), 2).forEach(([a, b]) => {
    const expected = ring.mul(a, b)
    test(`${a} ✕ ${b} ≡ ${expected} mod ${mod}`, () => expect(mul(a, b)).toBe(expected))
  })
}))
