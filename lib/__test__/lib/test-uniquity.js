'use strict'
const ProductIterable = require('product-iterable')

const testUniquity = array => () => {
  const indexed = Array.from(array).map((x, i) => [x, i])

  const errors = ProductIterable
    .pow(indexed, 2)
    .filter(([[x1, i1], [x2, i2]]) => i1 !== i2 && x1 === x2)
    .to(Array)

  if (errors.length) {
    const dups = errors
      .reduce((prev, [current]) => [...prev, ...current], [])
      .map(x =>
        [x, indexed.filter(([xx, i]) => x === xx).map(x => x[1])]
      )
      .map(([x, ii]) =>
        `${x} (${ii.map(i => '@' + i).join(' ')})`
      )

    const dupsstr = Array.from(new Set(dups)).join(', ')

    throw new Error(`Array contains duplicate elements: ${dupsstr}`)
  }
}

module.exports = testUniquity
