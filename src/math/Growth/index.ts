export default (n0: number, n1: number) => {
  if (n0 === 0 || isNaN(n0) || isNaN(n1)) return 0
  if (n0 === Infinity && n1 === Infinity) return 0
  if (n0 === Infinity) return -Infinity
  if (n1 === Infinity) return Infinity
  return Number(((n1 - n0) / n0).toFixed(10))
}
