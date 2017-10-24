'use strict'
const getsys = name => require(`../${name}`)(123)
const mainsys = getsys('system')

describe('Sub-modules', () => {
  for (const submdl of ['ring', 'inverse']) {
    const sys = getsys(submdl)
    test(
      'Should result same string',
      () => expect(String(sys)).toBe(String(mainsys[submdl]))
    )
  }
})

describe('Derived properties', () => {
  const ring = getsys('ring')
  for (const property in ring) {
    property === 'toString' || test(
      `Property: ${property}`,
      () => expect(String(mainsys[property])).toBe(String(ring[property]))
    )
  }
})
