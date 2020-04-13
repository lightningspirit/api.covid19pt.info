import categories from "./categories"
import { Config } from "../types"

const config: Config = require('../../config.json')

describe('categories', () => {
  it('fetches and parses successfully', async () => {
    return categories(config.urls.categories)
    .then((records) => {
      expect(records.length).toBeGreaterThan(1)
    })
  })
})
