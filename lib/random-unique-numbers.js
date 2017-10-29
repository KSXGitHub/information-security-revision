'use strict'
const {rng} = require('crypto')
const ProductIterable = require('product-iterable')
const {range} = require('range-iterable')

function randomUniqueNumbers (length) {
  const order = Array.from(rng(length)).map(x => parseInt(x * length / 256))
  let result = Array.from(range(length))
  for (const [a, b] of new ProductIterable(range(length), order)) {
    ; [result[b], result[a]] = [result[a], result[b]]
  }
  return result
}

module.exports = randomUniqueNumbers
