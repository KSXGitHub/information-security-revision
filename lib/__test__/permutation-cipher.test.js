'use strict'
const {rng} = require('crypto')
const {RangeIterable: {range}, ProductIterable} = require('x-iterable')
const Encryption = require('../permutation-cipher')
const tplstr = require('./lib/tuple-string')

describe('Valid use-cases', () => range(1, 6).forEach(size => {
  const encryption = new Encryption(size)

  describe(`size = ${size}, key = ${tplstr(encryption.key)}`, () => {
    describe('Compare size', () => {
      test('key.length === size', () => expect(encryption.key.length).toBe(size))
      test('encryption.size === size', () => expect(encryption.size).toBe(size))
    })

    describe('decrypt(encrypt(plain, key), key) === plain', () => range(4).forEach(count => {
      const {encrypt, decrypt} = encryption
      const length = count * size
      const plain = Array.from(rng(length))

      test(
        `length = ${length}, plain = ${tplstr(plain)}`,
        () => expect(decrypt(encrypt(plain))).toEqual(plain)
      )
    }))
  })
}))

describe('Invalid use-cases', () => {
  describe('Invalid key size', () => {
    ; ['', false, null, undefined, () => {}, {}].forEach(size => test(
      `typeof size = '${typeof size}'`,
      () => expect(() => new Encryption(size)).toThrow(/key size.*number/i)
    ))

    ; [-12, -1, 0].forEach(size => test(
      `size = ${size}`,
      () => expect(() => new Encryption(size)).toThrow(/key size.*less than 1/i)
    ))

    ; [1.2, 2.3, 3.4].forEach(size => test(
      `size = ${size}`,
      () => expect(() => new Encryption(size)).toThrow(/key size.*integer/i)
    ))
  })

  describe('Invalid plain/cipher size', () =>
    new ProductIterable(range(2, 6), range(12))
      .filter(([size, length]) => length % size)
      .forEach(([size, length]) => {
        const {key, encrypt, decrypt} = new Encryption(size)

        describe(`size = ${size}`, () => {
          const array = rng(length)

          test(
            `length = ${length}, encryption`,
            () => expect(() => encrypt(array)).toThrow(/dividable/i)
          )

          test(
            `length = ${length}, decryption`,
            () => expect(() => decrypt(array)).toThrow(/dividable/i)
          )
        })
      })
  )
})
