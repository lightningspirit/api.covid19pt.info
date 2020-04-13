import countries from "./countries"
import { Config } from "../types"

const config: Config = require('../../config.json')

describe('countries', () => {
  it('fetches and parses successfully', async () => {
    return countries({
      url: config.urls.countries
    })
    .then((records) => {
      expect(records.length).toBeGreaterThan(120)
    })
  })
})
