import { Config } from "./types";
import GetInsights from "./sources/insights";
import { flatten } from "lodash"
import { write, namespace } from "./data";

const config: Config = require("../config.json");

(async () => {

  console.log('Retrieving Insights')

  Object.keys(config.urls.insights).forEach(async iso2 => {
    console.log(`Retrieving ${iso2.toUpperCase()} Timeline`)

    let timeline = await GetInsights(config.urls.insights[iso2].country)

    if (config.urls.insights[iso2].groups) {
      console.log(`Retrieving ${iso2.toUpperCase()} Groups`)

      const groups = flatten(await Promise.all(config.urls.insights[iso2].groups!.map(async ({
        type, label, feed
      }) => (await GetInsights(feed)).map(stats => ({
        type,
        label,
        ...stats
      })))))

      timeline = timeline.map((stats) => ({
        ...stats,
        groups: groups.filter(({date}) => date?.getTime() === stats.date?.getTime()).map(group => {
          delete group.date
          return group
        })
      }))
    }


    await namespace(`data`)
    await namespace(`data/insights`)
    await namespace(`data/insights/${iso2}`)

    await write(`data/insights/${iso2}/timeline`, timeline)

    console.log(`Saved ${iso2.toUpperCase()} Timeline`)
  })

})()
