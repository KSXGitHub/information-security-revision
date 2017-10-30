'use strict'
const {inspect} = require('util')
const {abs, floor} = Math

const validint = x => {
  if (typeof x !== 'number' || !isFinite(x)) throw new TypeError(`${x} is not a number`)
  if (x % 1) throw new RangeError(`${x} is not an integer`)
  return x
}

const validmod = x => {
  validint(x)
  if (x < 2) throw new RangeError(`${x} is not greater than or equal to 2`)
  return x
}

const prototype = {
  toString () {
    return `ring(${this.mod})`
  },

  [inspect.custom] (_, options) {
    const string = String(this)
    return this.colors ? options.stylize(string) : string
  }
}

const ring = mod => {
  validmod(mod)
  const id = x => floor(abs(validint(x))) % mod
  const add = (a, b) => id(id(a) + id(b))
  const mul = (a, b) => id(id(a) * id(b))
  return {mod, id, add, mul, __proto__: prototype}
}

module.exports = Object.assign(ring, {validint, validmod, prototype, ring})
