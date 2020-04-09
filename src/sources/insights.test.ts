import insights from "./insights"
import { Config } from "../types"

const config: Config = require('../config.json')

describe('insights', () => {
  it('fetches and parses successfully', async () => {
    return insights(config.urls.insights['pt'].country)
    .then((stats) => {
      expect(stats.length).toBeGreaterThan(10)
    })
  })

  it('gets first portuguese day', async () => {
    return insights(config.urls.insights['pt'].country)
    .then((stats) => {
      expect(stats.length).toBeGreaterThan(10)
      expect(stats[0]).toMatchObject({
        date: new Date("2020-03-03T00:00:00.000Z"),
        cases: {
          confirmed: {
            total: 4,
          },
          active: {
            total: 4
          },
          exposure: {
            total: 2
          },
          imported: {
            total: 2
          },
          nonConfirmed: {
            total: 0,
          },
          surveillance: {
            total: 0
          },
          suspects: {
            total: 101,
          },
        },
        deaths: {
          total: 0,
        },
        recovered: {
          total: 0,
        },
        testing: {
          total: 101
        },
        transmission: {
          knownChains: 0
        },
        critical: {
          total: 0,
        },
        hospitalization: {
          total: 0,
        }
      })
    })
  })

  it('gets 10th portuguese day', async () => {
    return insights(config.urls.insights['pt'].country)
    .then((stats) => {
      expect(stats[9]).toMatchObject({
        date: new Date("2020-03-12T00:00:00.000Z"),
        cases: {
          confirmed: {
            total: 78,
          },
          active: {
            total: 78
          },
          exposure: {
            total: 59
          },
          imported: {
            total: 18
          },
          nonConfirmed: {
            total: 0,
          },
          surveillance: {
            total: 4923
          },
          suspects: {
            total: 637,
          },
        },
        deaths: {
          total: 0,
        },
        recovered: {
          total: 0,
        },
        testing: {
          total: 637
        },
        transmission: {
          knownChains: 6
        },
        critical: {
          total: 0,
        },
        hospitalization: {
          total: 69,
        }
      })
    })
  })
})
