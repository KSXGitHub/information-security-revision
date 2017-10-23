'use strict'
const {inspect} = require('util')
const {abs, floor} = Math

const validint = x => {
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
    return options.colors
      ? options.stylize('ring') + `(${this.mod})`
      : `ring(${this.mod})`
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
