import { Config } from "./types";
import World from "./sources/world";
import { resource, collection } from "./responses/Hal";
import { write, namespace } from "./data";
import { Population } from "./api.types";
import GetTimeline from "./sources/world-timeline";
import normalizer from "./normalizer";

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

  let timeline = await GetTimeline(config.urls.historical, 'all')

  timeline = normalizer(timeline, [
    'cases.confirmed',
  ], {
    enableDoublingTime: true,
  })

  timeline = normalizer(timeline, [
    'cases.confirmed',
    'cases.active',
    'recovered',
    'deaths',
  ], {
    enableGrowth: true,
  })

  timeline = normalizer(timeline, [
    'cases.confirmed',
    'cases.active',
    'recovered',
    'deaths',
    'critical',
  ], {
    enableToday: true,
  })

  timeline = normalizer(timeline, [
    'cases.confirmed',
    'cases.active',
    'recovered',
    'deaths',
    'critical',
  ], {
    enable5dayAvg: true,
  })

  await namespace(`build`)

  await write('build/index', resource(
    "Current World Statistics",
    {
      self: {
        title: "Current World Statistics",
        href: `${config.apiUrl}/`
      },
      timeline: {
        title: "World Statistics Timeline",
        href: `${config.apiUrl}/timeline/`
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

  await namespace(`build/timeline`)

  await write('build/timeline/index', collection(
    "World Timeline",
    {
      self: {
        title: "World Timeline",
        href: `${config.apiUrl}/timeline/`
      },
      parent: {
        href: `${config.apiUrl}/`
      }
    },
    timeline
  ))

  console.log('Saved World')

})()
