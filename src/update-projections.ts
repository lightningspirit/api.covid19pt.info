import { Config } from "./types";
import GetProjections from "./sources/projections"
import { write, namespace } from "./data";

const config: Config = require("../config.json");

(async () => {
  console.log('Retrieving Projections')

  Object.keys(config.urls.projections).forEach(async iso2 => {
    console.log(`Retrieving ${iso2.toUpperCase()} Projections`)

    let projections = await GetProjections(config.urls.projections[iso2])

    await namespace(`data`)
    await namespace(`data/projections`)

    await write(`data/projections/${iso2}`, projections)

    console.log(`Saved ${iso2.toUpperCase()} Projections`)
  })

})()
