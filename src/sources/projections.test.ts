import projections from "./projections"
import { Config } from "../types"

const config: Config = require('../config.json')

describe('projections', () => {
  it('fetches and parses successfully', async () => {
    return projections(config.urls.projections.pt)
    .then((records) => {
      expect(records.length).toBeGreaterThan(1)
    })
  })

  it('record has right types', async () => {
    return projections(config.urls.projections.pt)
    .then((records) => {
      expect(records[0].date).toBeInstanceOf(Date)
      expect(records[0].nodes[0].date).toBeInstanceOf(Date)
      expect(records[0].nodes[0].min).toBeGreaterThan(1)
      expect(records[0].nodes[0].max).toBeGreaterThan(1)
      expect(
        records[0].nodes[0].max > records[0].nodes[0].min
      ).toBe(true)
    })
  })
})
