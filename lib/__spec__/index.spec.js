'use strict'
const pkgname = require('../../package.json').name
const received = require('..')

const capitalize = string => {
  const [first, ...rest] = string
  return first.toUpperCase() + rest.join('').toLowerCase()
}

const dashToMixedCase = string => {
  const [first, ...rest] = string.split('-')
  return [first, ...rest.map(capitalize)].join('')
}

const unit = name => {
  const property = dashToMixedCase(name)
  test(
    `require('${pkgname}/${name}') === require('${pkgname}').${property}`,
    () => expect(require(`../${name}`)).toBe(received[property])
  )
}

unit('basic-operators')
unit('substitution-cipher')
unit('ring')
unit('inverse')
unit('system')
