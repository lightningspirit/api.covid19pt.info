import { Stats } from "../api.types"
import ZeroOrPositive from "../math/ZeroOrPositive"
import DoublingTime from "../math/DoublingTime"
import { get, set } from "lodash"
import Average from "../math/Average"
import Growth from "../math/Growth"
import PerMillionOfPopulation from "../math/PerMillionOfPopulation"

export default (stats: Stats[], population: number) => {
  const metrics = [
    'cases.confirmed',
    'cases.active',
    //'cases.nonConfirmed',
    //'cases.suspects',
    'recovered',
    'deaths',
  ]

  const growths: {
    [s:string]: number
  }[] = []

  const averages: {
    [s:string]: number
  }[] = []

  const doublingTime: {
    [s:string]: number
  }[] = []

  const perOneMillion: {
    [s:string]: number
  }[] = []

  const today: {
    [s:string]: number
  }[] = []

  stats.forEach((record, index) => {
    const previousFour = ZeroOrPositive(index - 4)
    const previousOne = ZeroOrPositive(index - 1)

    growths[index] = {}
    averages[index] = {}
    doublingTime[index] = {}
    perOneMillion[index] = {}
    today[index] = {}

    metrics.forEach(key => {
      const previousRecord = stats[previousOne]

      const totalKey = `${key}.total`

      const thisValue = get(record, totalKey)
      const previousValue = get(previousRecord, totalKey)

      // @ts-ignore
      growths[index][key] = previousValue ? Growth(Number(previousValue), Number(thisValue)) : 0
      // @ts-ignore
      averages[index][key] = previousValue
        ? Average(growths.slice(previousFour, index + 1).map(r => Number(r[key])))
        : 0

      doublingTime[index][key] = isFinite(averages[index][key]) ? DoublingTime(averages[index][key]) : 0
      // @ts-ignore
      perOneMillion[index][key] = PerMillionOfPopulation(get(record, totalKey), population)
      // @ts-ignore
      today[index][key] = index > 0
        ? Math.abs(get(record, totalKey) - get(stats[previousOne], totalKey))
        : Number(get(record, totalKey))
    })
  })

  return stats.map((record, index) => {
    metrics.forEach((key) => {
      if (get(record, `${key}.total`)) {
        set(record, `${key}.perOneMillion`, perOneMillion[index][key])
        set(record, `${key}.today`, today[index][key])
        set(record, `${key}.doublingTime`, doublingTime[index][key])
        set(record, `${key}.growth`, growths[index][key])
      }
    })

    return record
  })
}
