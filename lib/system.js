'use strict'
const mkring = require('./ring')
const mkinverse = require('./inverse')
const mkinmul = require('./indian-multiply')

const system = m => {
  const ring = mkring(m)
  const inverse = mkinverse(ring)
  const indianMultiply = mkinmul(ring)

  return {
    ring,
    inverse,
    indianMultiply,
    toString () {
      return `CryptoGraphicSystem(${this.ring})`
    },
    __proto__: ring
  }
}

module.exports = system
