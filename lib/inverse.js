'use strict'
const {floor} = Math

// Use Extended Euclidean algorithm to find inverse
const inverse = ring => x => {
  const forward = (oldv, newv, quotient) => [newv, oldv - quotient * newv]
  let [oldt, newt, oldr, newr] = [0, 1, ring.mod, x]

  while (newr) {
    const quotient = floor(oldr / newr)
    ; [oldt, newt] = forward(oldt, newt, quotient)
    ; [oldr, newr] = forward(oldr, newr, quotient)
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
