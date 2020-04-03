import ZeroOrPositive from "."

describe('ZeroOrPositive', () => {
  const samples = [
    [0, 0],
    [-1, 0],
    [1, 1],
  ]

  it.each(samples)('ZeroOrPositive(%d) = %d', (
    n, r
  ) => {
    expect(ZeroOrPositive(n)).toBe(r)
  })
})
