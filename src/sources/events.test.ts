import events from "./events"
import { Config } from "../types"

const config: Config = require('../config.json')

describe('events', () => {
  it('fetches and parses successfully', async () => {
    return events(config.urls.events)
    .then((records) => {
      expect(records.length).toBeGreaterThan(1)
    })
  })

  it('first record has date', async () => {
    return events(config.urls.events)
    .then((records) => {
      expect(records[0].date).toBeInstanceOf(Date)
    })
  })
})
