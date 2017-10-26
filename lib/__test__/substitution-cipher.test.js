'use strict'
const {rng} = require('crypto')
const {RangeIterable, ProductIterable} = require('x-iterable')
const Encryption = require('../substitution-cipher')
const {key, encryptElement, decryptElement, encrypt, decrypt} = new Encryption()
expect.extend(require('jest-tobetype'))

const hex = array =>
  Buffer.from(array).toString('hex').toUpperCase()

const longhex = array => array.length > 10
  ? `${hex(array.slice(0, 8))}...${hex(array.slice(-8))}`
  : hex(array)

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

  describe('randomUniqueNumbers(length)', () => describe(
    'should contain only integers in range [0; length)',
    () => RangeIterable.range(5).map(x => 1 << x).forEach(length => {
      const array = randomUniqueNumbers(length)
      describe(`length = ${length}, array = [${array.join(', ')}]`, () => {
        array.forEach(x => test(`x = ${x}`, () => {
          expect(x).toBeType('number')
          expect(x).toBeGreaterThanOrEqual(0)
          expect(x).toBeLessThan(length)
          expect(x % 1).toBe(0)
        }))
      })
    })
  ))

  describe(
    'should not contain any duplicate element',
    () => RangeIterable.range(5).map(x => 1 << x).forEach(length => {
      const array = randomUniqueNumbers(length)
      test(`length = ${length}, array = [${array.join(', ')}]`, testUniquity(array))
    })
  )
})
