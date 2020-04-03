import PerMillionPopulation from "."

describe('PerMillionPopulation', () => {
  const samples: [number, number, number][] = [
    [4, 10000000, 0],
    [800, 10000000, 80],
  ]

  it.each(samples)('PerMillionPopulation(%d, %d) = %d', (
    n, population, result
  ) => {
    expect(PerMillionPopulation(n, population)).toBe(result)
  })
})
