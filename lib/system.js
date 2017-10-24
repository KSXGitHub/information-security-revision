'use strict'
const mkring = require('./ring')
const mkinverse = require('./inverse')

const system = m => {
  const ring = mkring(m)
  const inverse = mkinverse(ring)

  return {
    ring,
    inverse,
    toString () {
      return `CryptoGraphicSystem(${this.ring})`
    },
    __proto__: ring
  }
}

module.exports = system
