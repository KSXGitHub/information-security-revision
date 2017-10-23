'use strict'
const {RangeIterable, ProductIterable, ConcatIterable} = require('x-iterable')
const mkring = require('../ring')

describe('Invalid use-cases', () => {
  test('Non-int modulo', () => expect(() => mkring(0.1234)).toThrow(/not an integer/i))

  describe('Lesser-than-2 modulos', () => {
    const regex = /greater than or equal to 2/i
    test('m < 0', () => expect(() => mkring(-12)).toThrow(regex))
    test('m = 0', () => expect(() => mkring(0)).toThrow(regex))
    test('0 < m < 2', () => expect(() => mkring(1)).toThrow(regex))
  })

  describe('Non-int operands', () => {
    const {id, add, mul} = mkring(123)
    const regex = /not an integer/i

    test('.id(x)', () => expect(() => id(15.24)).toThrow(regex))

    describe('.add(a, b)', () => {
      test('a ∉ Z, b ∈ Z', () => expect(() => add(2.3, 4)).toThrow(regex))
      test('a ∈ Z, b ∉ Z', () => expect(() => add(2, 4.9)).toThrow(regex))
      test('a, b ∉ Z', () => expect(() => add(15.24, 3.2)).toThrow(regex))
    })

    describe('.mul(a, b)', () => {
      test('a ∉ Z, b ∈ Z', () => expect(() => mul(2.3, 4)).toThrow(regex))
      test('a ∈ Z, b ∉ Z', () => expect(() => mul(2, 4.9)).toThrow(regex))
      test('a, b ∉ Z', () => expect(() => mul(15.24, 3.2)).toThrow(regex))
    })
  })
})

describe('Identity', () => {
  RangeIterable.range(2, 10).forEach(mod => test(
    `ring(${mod}).mod === ${mod}`,
    () => expect(mkring(mod).mod).toBe(mod)
  ))
})

describe('Range tests', () => {
  const {range} = RangeIterable
  const {pow} = ProductIterable
  const modlist = new ConcatIterable(range(2, 4), [8, 13])
  const vallist = new ConcatIterable(range(-4, 5), [-7, -12, 8, 13])

  modlist.forEach(m => describe(`ring(${m})`, () => {
    const {id, add, mul} = mkring(m)

    describe(
      '.id(x)',
      () => vallist.forEach(x => test(`.id(${x}) ∈ ring(${m})`, () => expect(id(x)).toBeLessThan(m)))
    )

    describe(
      '.add(a, b)',
      () => pow(vallist, 2).forEach(
        ([a, b]) => test(
          `.add(${a}, ${b}) ∈ ring(${m})`,
          () => expect(add(a, b)).toBeLessThan(m))
      )
    )

    describe(
      '.mul(a, b)',
      () => pow(vallist, 2).forEach(
        ([a, b]) => test(
          `.mul(${a}, ${b}) ∈ ring(${m})`,
          () => expect(mul(a, b)).toBeLessThan(m))
      )
    )
  }))
})

describe('ring(2)', () => {
  const {id, add, mul} = mkring(2)

  describe('.id(x)', () => {
    for (const x of RangeIterable.range(2 ** 3)) {
      const remain = x & 1
      test(`${x} ≡ ${remain} mod 2`, () => expect(id(x)).toBe(remain))
    }
  })

  describe('.add(a, b)', () => {
    test('2 + 4 ≡ 0 mod 2', () => expect(add(2, 4)).toBe(0))
    test('12 + 3 ≡ 1 mod 2', () => expect(add(12, 3)).toBe(1))
  })

  describe('.mul(a, b)', () => {
    test('2 ✕ 8 ≡ 0 mod 2', () => expect(mul(2, 8)).toBe(0))
    test('4 ✕ 7 ≡ 0 mod 2', () => expect(mul(4, 7)).toBe(0))
    test('3 ✕ 5 ≡ 1 mod 2', () => expect(mul(3, 5)).toBe(1))
  })
})

describe('ring(3)', () => {
  const { id, add, mul } = mkring(3)

  describe('.id(x)', () => {
    for (const x of RangeIterable.range(3 ** 2)) {
      const remain = x % 3
      test(`${x} ≡ ${remain} mod 3`, () => expect(id(x)).toBe(remain))
    }
  })

  describe('.add(a, b)', () => {
    test('2 + 4 ≡ 0 mod 3', () => expect(add(2, 4)).toBe(0))
    test('12 + 4 ≡ 1 mod 3', () => expect(add(12, 4)).toBe(1))
    test('22 + 4 ≡ 2 mod 3', () => expect(add(22, 4)).toBe(2))
  })

  describe('.mul(a, b)', () => {
    test('2 ✕ 6 ≡ 0 mod 3', () => expect(mul(2, 6)).toBe(0))
    test('2 ✕ 5 ≡ 1 mod 3', () => expect(mul(2, 5)).toBe(1))
    test('2 ✕ 4 ≡ 2 mod 3', () => expect(mul(2, 4)).toBe(2))
  })
})

describe('ring(8)', () => {
  const {id, add, mul} = mkring(8)

  describe('.id(x)', () => {
    for (const x of RangeIterable.range(8 ** 2)) {
      const remain = x % 8
      test(`${x} ≡ ${remain} mod 8`, () => expect(id(x)).toBe(remain))
    }
  })

  describe('.add(a, b)', () => {
    test('4 + 4 ≡ 0 mod 8', () => expect(add(4, 4)).toBe(0))
    test('12 + 5 ≡ 1 mod 8', () => expect(add(12, 5)).toBe(1))
    test('22 + 7 ≡ 5 mod 8', () => expect(add(22, 7)).toBe(5))
  })

  describe('.mul(a, b)', () => {
    test('4 ✕ 4 ≡ 0 mod 8', () => expect(mul(4, 4)).toBe(0))
    test('2 ✕ 5 ≡ 2 mod 8', () => expect(mul(2, 5)).toBe(2))
    test('5 ✕ 7 ≡ 3 mod 8', () => expect(mul(5, 7)).toBe(3))
  })
})
