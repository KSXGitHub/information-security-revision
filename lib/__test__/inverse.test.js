'use strict'
const {RangeIterable, ConcatIterable} = require('x-iterable')
const mkring = require('../ring')
const mkinverse = require('../inverse')

function simpleInverse (x, m) {
  const success = RangeIterable
    .range(m)
    .map(payload => ({success: true, payload}))
    .find(({payload}) => (x * payload) % m === 1)

  return success || {success: false}
}

function representPayload ({success, payload}) {
  return success ? payload : '🗙'
}

new ConcatIterable(
  RangeIterable.range(2, 6),
  [7, 10, 16]
).forEach(mod => describe(`ring(${mod})`, () => {
  const inverse = mkinverse(mkring(mod))
  RangeIterable
    .range(mod)
    .map(x =>
      [x, simpleInverse(x, mod)]
    )
    .forEach(([x, expectation]) => test(
      `inverse(${x}) → ${representPayload(expectation)}`,
      () => expect(inverse(x)).toEqual(expectation)
    ))
}))
