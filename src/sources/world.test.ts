import world from "./world"
import { Config } from "../types"
import { Population } from "../api.types";

const config: Config = require('../../config.json')
const {
  world: population
}: {
  world: Population
  countries: {
    iso2: string
    population: Population
  }[]
} = require("../../data/population.json");

describe('world', () => {
  it('fetches and parses successfully', async () => {
    return world({
      url: config.urls.world,
      population
    })
    .then((world) => {
      expect(world.stats.date).toBeInstanceOf(Date)
      expect(world.stats.cases.active!.total).toBeGreaterThan(1)
      expect(world.stats.cases.confirmed.total).toBeGreaterThan(1)
      expect(world.stats.deaths!.total).toBeGreaterThan(1)
      expect(world.stats.recovered!.total).toBeGreaterThan(1)
    })
  })
})
