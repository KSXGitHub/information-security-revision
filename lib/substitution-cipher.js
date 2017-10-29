'use strict'
const {range} = require('range-iterable')
const randomUniqueNumbers = require('./random-unique-numbers')

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

module.exports = class extends SubstitutionCipher {}
