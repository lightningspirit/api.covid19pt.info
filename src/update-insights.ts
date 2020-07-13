import { Config } from "./types";
import GetInsights from "./sources/insights";
import { flatten } from "lodash"
import { write, namespace } from "./data";
import fetcher from "./fetcher";

const config: Config = require("../config.json");

(async () => {

  console.log('Retrieving Insights')

  Object.keys(config.urls.insights).forEach(async iso2 => {
    console.log(`Retrieving ${iso2.toUpperCase()} Timeline`)

    let timeline = await GetInsights(config.urls.insights[iso2].country)
    let testing = await fetcher<{
      data: string
      amostras: string
      amostras_novas: string
    }[], {date: Date, testing: { total: number }}[]>(
      config.urls.insights[iso2].testing,
      records => {
        return records.map(({
          data, amostras,
        }) => {
          return ({
            date: new Date(data.split('-').reverse().join('-')),
            testing: {
              total: Number(amostras)
            }
          })
        })
      }
    )

    timeline.forEach(({date}, index) => {
      const pindex = testing.findIndex(({date: pdate}) => date?.getTime() === pdate.getTime())

      if (pindex === -1 && index > 0)
        timeline[index] = {
          ...timeline[index],
          testing: {
            ...timeline[index].testing,
            total: timeline[index - 1].testing && timeline[index].cases.suspects && timeline[index - 1].cases.suspects
            // @ts-ignore
            ? timeline[index - 1].testing.total + timeline[index].cases.suspects.total - timeline[index - 1].cases.suspects.total
            : timeline[index - 1].testing
            // @ts-ignore
            ? timeline[index - 1].testing.total
            : 0
          }
        }

      else
        timeline[index] = {
          ...timeline[index],
          testing: {
            ...timeline[index].testing,
            ...testing[pindex].testing
          }
        }
    })

    /*if (config.urls.insights[iso2].groups) {
      console.log(`Retrieving ${iso2.toUpperCase()} Groups`)

      const groups = flatten(await Promise.all(config.urls.insights[iso2].groups!.map(async ({
        type, label, feed
      }) => {
        return (await GetInsights(feed)).map(stats => ({
        type,
        label,
        ...stats
      }))})))

      timeline = timeline.map((stats) => {
        return ({
          ...stats,
          groups: groups.filter(({date}) => date?.getTime() === stats.date?.getTime()).map(group => {
            delete group.date
            return group
          })
        })
      })
    }*/


    await namespace(`data`)
    await namespace(`data/insights`)
    await namespace(`data/insights/${iso2}`)

    await write(`data/insights/${iso2}/timeline`, timeline)

    console.log(`Saved ${iso2.toUpperCase()} Timeline`)
  })

})()
