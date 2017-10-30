'use strict'

const gcd = (a, b) => b ? gcd(b, a % b) : a

const validate = x => {
  if (typeof x !== 'number' || !isFinite(x)) throw new TypeError(`${x} is not a number`)
  if (x < 0) throw RangeError(`${x} is not greater than or equal to 0`)
  if (x % 1) throw new RangeError(`${x} is not an integer`)
  return x
}

module.exports = Object.assign(
  (a, b) => gcd(validate(a), validate(b)),
  {validate}
)
