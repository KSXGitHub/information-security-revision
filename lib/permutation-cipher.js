'use strict'
const chunk = require('chunk')
const ProductIterable = require('product-iterable')
const {range} = require('range-iterable')
const randomUniqueNumbers = require('./random-unique-numbers')

function validateKeySize (length) {
  if (typeof length !== 'number') throw new TypeError(`Key size must be a number: ${length}`)
  if (length < 1) throw new RangeError(`Key size cannot be less than 1: ${length}`)
  if (length % 1) throw new RangeError(`Key size must be an integer: ${length}`)
  return length
}

function PermutationCipher (size) {
  validateKeySize(size)
  const key = randomUniqueNumbers(size)

  function validateSequenceSize (sequence) {
    if (sequence.length % size) {
      throw new RangeError(`Sequence size must be dividable by ${size}: ${sequence.length}`)
    }
    return sequence
  }

  const encryptChunk = chunk => key.map(k => chunk[k])

  const encrypt = plain => chunk(plain, size)
    .map(encryptChunk)
    .reduce((prev, current) => [...prev, ...current], [])

  const decryptChunk = chunk => ProductIterable
    .pow(range(size), 2)
    .filter(([i, j]) => key[j] === i)
    .map(pair => chunk[pair[1]])
    .to(Array)

  const decrypt = cipher => chunk(cipher, size)
    .map(decryptChunk)
    .reduce((prev, current) => [...prev, ...current], [])

  const mkfn = fn => seq => fn(validateSequenceSize(seq))

  return {
    key,
    size,
    encrypt: mkfn(encrypt),
    decrypt: mkfn(decrypt),
    encryptChunk,
    decryptChunk,
    validateSequenceSize,
    __proto__: this
  }
}

module.exports = Object.assign(
  class extends PermutationCipher {},
  {
    validateKeySize
  }
)
