'use strict'
const {rng} = require('crypto')
const {RangeIterable} = require('x-iterable')
const Encryption = require('../substitution-cipher')
const {hex, longhex} = require('./lib/hex-string')
const testUniquity = require('./lib/test-uniquity')
const {key, encryptElement, decryptElement, encrypt, decrypt} = new Encryption()

describe(`key = ${longhex(key)}`, () => {
  test('Key size should be 256', () => expect(key.length).toBe(256))
  test('Every element of key is unique', testUniquity(key))
})

describe('Encrypt/Decrypt individual characters', () =>
  Uint8Array.from(rng(10)).forEach((x, i) => test(
    `i = ${i}, x = ${hex([x])}; decrypt(encrypt(x)) === x`,
    () => expect(decryptElement(encryptElement(x))).toBe(x)
  ))
)

describe('Encrypt/Decrypt sequences', () => RangeIterable
  .range(10)
  .map(length => Uint8Array.from(rng(length)))
  .forEach(plain => describe(`length = ${plain.length}, plain = ${hex(plain) || '∅'}`, () => {
    const cipher = encrypt(plain)

    test(
      'cipher.length === plain.length',
      () => expect(cipher.length).toBe(plain.length)
    )

    test(
      'decrypt(encrypt(plain)) === plain',
      () => expect(decrypt(cipher)).toEqual(plain)
    )
  }))
)
