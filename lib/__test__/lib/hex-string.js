'use strict'

const hex = array =>
  Buffer.from(array).toString('hex').toUpperCase()

const longhex = array => array.length > 10
  ? `${hex(array.slice(0, 8))}...${hex(array.slice(-8))}`
  : hex(array)

module.exports = {hex, longhex}
