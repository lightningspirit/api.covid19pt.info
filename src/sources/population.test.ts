import { single } from "./population"
import { Config } from "../types"

const config: Config = require('../../config.json')

describe('population', () => {
  it('fetches and parses successfully', async () => {
    return single({
      url: config.urls.population, name: 'World'
    })
    .then((records) => {
      expect(records.everyone.females).toBeGreaterThan(100000)
      expect(records.everyone.males).toBeGreaterThan(100000)
      expect(records.everyone.total).toBeGreaterThan(100000)
      expect(records.groups.length).toBe(5)
    })
  })
})
