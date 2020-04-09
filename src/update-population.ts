import { Config } from "./types"
import GetPopulation, { single as GetWorldPopulation } from "./sources/population";
import { Population } from "./api.types";
import { ContinentNames } from "./sources/continentPt";
import { write, namespace } from "./data";

const config: Config = require("./config.json");

(async () => {
  console.log('Retrieving World Population')

  const world = await GetWorldPopulation({
    url: config.urls.population,
    name: "World"
  })

  console.log(`Retrieving Countries Population`)

  const population: {
    iso2: string
    population: Population
  }[] = [];

  const continent: {
    iso2: string
    continent: keyof typeof ContinentNames
  }[] = [];

  (await GetPopulation({
    url: config.urls.population,
  })).forEach(({
    population: p, continent: c, iso2
  }) => {
    population.push({
      iso2, population: p
    })

    continent.push({
      iso2, continent: c
    })
  })

  await namespace(`data`)
  await write(`data/population`, {
    world,
    countries: population
  })

  console.log('Saved Population')

  await write(`data/continents`, continent)

  console.log('Saved Continents')

})()
