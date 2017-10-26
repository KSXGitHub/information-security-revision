'use strict'
const {rng} = require('crypto')
const {RangeIterable, ProductIterable} = require('x-iterable')
const Encryption = require('../substitution-cipher')
const {key, encryptElement, decryptElement, encrypt, decrypt} = new Encryption()

const hex = array =>
  Buffer.from(array).toString('hex').toUpperCase()

const longhex = array => array.length > 10
  ? `${hex(array.slice(0, 8))}...${hex(array.slice(-8))}`
  : hex(array)

const testUniquity = array => () => {
  const errors = ProductIterable
    .pow(Array.from(array).map((x, i) => [x, i]), 2)
    .filter(([[x1, i1], [x2, i2]]) => i1 !== i2 && x1 === x2)
    .to(Array)

  if (errors.length) {
    const dups = Array.from(new Set(
      errors.reduce((prev, current) => [...prev, ...current], [])
    ))

    throw new Error(`Array contains duplicate elements: ${dups.join(', ')}`)
  }
}

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

describe('Internal components', () => {
  const {randomUniqueNumbers} = Encryption.__utils

  describe(
    'randomUniqueNumbers(length) should not contain any duplicate element',
    () => RangeIterable.range(5).map(x => 1 << x).forEach(length => {
      const array = randomUniqueNumbers(length)
      test(`length = ${length}, array = [${array.join(', ')}]`, testUniquity(array))
    })
  )
})
