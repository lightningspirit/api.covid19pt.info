import { Stats } from "../api.types"
import ZeroOrPositive from "../math/ZeroOrPositive"
import DoublingTime from "../math/DoublingTime"
import { get, set } from "lodash"
import Average from "../math/Average"
import Growth from "../math/Growth"
import PerMillionOfPopulation from "../math/PerMillionOfPopulation"

export default (stats: Stats[], metrics = [
  'cases.confirmed',
], {
  enablePerOneMillion = false,
  enableToday = false,
  enableGrowth = false,
  enableDoublingTime = false,
  enable5dayAvg = false,
}, population?: number) => {

  if (enablePerOneMillion && !population) {
    throw new Error('enablePerOneMillion needs population to be filled')
  }

  const growths: {
    [s:string]: number
  }[] = []

  const averages: {
    [s:string]: number
  }[] = []

  const averagesTodays: {
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
    averagesTodays[index] = {}
    doublingTime[index] = {}
    perOneMillion[index] = {}
    today[index] = {}

    metrics.forEach(key => {
      const previousRecord = stats[previousOne]

      const totalKey = `${key}.total`
      const todayKey = `${key}.today`

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
        ? Math.round(get(record, totalKey) - get(stats[previousOne], totalKey))
        : Number(get(record, totalKey))

      // @ts-ignore
      averagesTodays[index][key] = get(previousRecord, todayKey)
        ? Average(today.slice(previousFour, index + 1).map(r => Number(r[key])))
        : 0
    })
  })

  return stats.map((record, index) => {
    metrics.forEach((key) => {
      if (get(record, `${key}.total`)) {
        if (enablePerOneMillion) set(record, `${key}.perOneMillion`, perOneMillion[index][key])
        if (enableToday) set(record, `${key}.today`, today[index][key])
        if (enableDoublingTime) set(record, `${key}.doublingTime`, doublingTime[index][key])
        if (enableGrowth) set(record, `${key}.growth`, growths[index][key])
        if (enable5dayAvg) set(record, `${key}.avg5days`, averagesTodays[index][key])
      }
    })

    if (record.events?.length === 0)
      delete record.events

    return record
  })
}
