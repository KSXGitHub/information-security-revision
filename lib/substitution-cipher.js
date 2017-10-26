'use strict'
const {rng} = require('crypto')
const ProductIterable = require('product-iterable')
const {range} = require('range-iterable')

function randomUniqueNumbers (length) {
  const order = Array.from(rng(length)).map(x => parseInt(x * length / 255))
  let result = Array.from(range(length))
  for (const [a, b] of new ProductIterable(range(length), order)) {
    [result[b], result[a]] = [result[a], result[b]]
  }
  return result
}

function SubstitutionCipher () {
  const key = Uint8Array.from(randomUniqueNumbers(1 << 8))
  const encryptElement = x => key[x & 255]
  const decryptElement = y => range(256).find(x => encryptElement(x) === y)
  const encrypt = plain => Uint8Array.from(plain).map(encryptElement)
  const decrypt = cipher => Uint8Array.from(cipher).map(decryptElement)

  return Object.freeze({
    key,
    encryptElement,
    decryptElement,
    encrypt,
    decrypt,
    __proto__: this
  })
}

module.exports = Object.assign(
  class extends SubstitutionCipher {},
  {
    __utils: {randomUniqueNumbers}
  }
)
