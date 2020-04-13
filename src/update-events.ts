import { Config } from "./types";
import Events from "./sources/events"
import Categories from "./sources/categories"
import { write, namespace } from "./data";

const config: Config = require("../config.json");

(async () => {
  console.log('Retrieving Events')
  const events = await Events(config.urls.events)

  await namespace(`data`)
  await write('data/events', events)

  console.log('Saved Events')

  console.log('Retrieving Event Categories')
  const categories = await Categories(config.urls.categories)

  await write('data/categories', categories)
  console.log('Saved Event Categories')

})()
