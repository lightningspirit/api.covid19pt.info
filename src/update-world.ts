import { Config } from "./types";
import World from "./sources/world";
import { resource } from "./responses/Hal";
import { write } from "./data";
import { Population } from "./api.types";

const config: Config = require("./config.json");
const population: {
  world: Population
  countries: {
    iso2: string
    population: Population
  }[]
} = require("../data/population.json");

(async () => {
  console.log('Retrieving World Population')

  console.log('Retrieving World Stats')

  const world = await World({
    url: config.urls.world,
    population: population.world
  })

  await write('index', resource(
    "API for Covid19pt.info dashboard",
    {
      self: {
        title: "Current World Statistics",
        href: `${config.apiUrl}/`
      },
      events: {
        title: "Events Timeline",
        href: `${config.apiUrl}/events/`
      },
      categories: {
        title: "Event Categories",
        href: `${config.apiUrl}/categories/`
      },
      countries: {
        title: "Current Countries Statistics",
        href: `${config.apiUrl}/countries/`
      }
    },
    world
  ))

  console.log('Saved World')

})()
