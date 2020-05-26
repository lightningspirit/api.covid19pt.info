import Average from "."

describe('Average', () => {
  const samples: [number[], number][] = [
    [[0, 1], 0.5],
    [[1, 2], 1.5],
    [[2, 4, 6], 4],
    [[2, Infinity], Infinity],
    [[2, -1], 0.5],
    [[-2, 1], -0.5],
  ]

  it.each(samples)('Average(%p) = %d', (
    el, avg
  ) => {
    expect(Average(el)).toBe(avg)
  })

  it('throws error when a NaN is present', () => {
    expect(
      // @ts-ignore
      () => Average([1, 'a'])
    ).toThrowError('Impossible to average with a NaN')
  })
})
