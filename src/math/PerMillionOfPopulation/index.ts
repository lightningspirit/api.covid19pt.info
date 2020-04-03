const ONE_MILLION = 1000000

export default (n: number, population: number) => {
  return Math.round((n / population * ONE_MILLION))
}
