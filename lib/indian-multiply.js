'use strict'

const multiply = ring => {
  const {id, add} = ring

  const fn = (a, b) =>
    b && add((b & 1 ? a : 0), fn(a, b >> 1) << 1)

  return (a, b) => id(fn(id(a), id(b)))
}

module.exports = multiply
