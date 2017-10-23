'use strict'
const {floor} = Math

// Use Extended Euclidean algorithm to find inverse
const inverse = ring => x => {
  let [oldt, newt, oldr, newr] = [0, 1, ring.mod, x]

  while (newr) {
    const quotient = floor(oldr / newr)
    ; [oldt, newt] = [newt, oldt - quotient * newt]
    ; [oldr, newr] = [newr, oldr - quotient * newr]
  }

  return oldr > 1
    ? {
      success: false
    }
    : {
      success: true,
      payload: oldt + (oldt < 0 ? ring.mod : 0)
    }
}

module.exports = inverse
