import timeline from "./timeline"
import { Config } from "../types"

const config: Config = require('../config.json')

describe('historical', () => {
  it('fetches and parses successfully', async () => {
    return timeline(config.urls.historical, 'pt')
    .then((timeline) => {
      expect(timeline!.length).toBeGreaterThan(10)
      expect(timeline![0]).toMatchObject({
        date: new Date("2020-01-22T00:00:00.000Z"),
        cases: { confirmed: { total: 0 } },
        deaths: { total: 0 },
        recovered: { total: 0 },
      })
    })
  })
})
