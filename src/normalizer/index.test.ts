import normalizer from "."
import insights from "../sources/insights"
import { Config } from "../types"

const config: Config = require('../config.json')

describe('insights', () => {
  it('gets first portuguese day', async () => {
    return insights(config.urls.insights['pt'].country)
    .then((stats) => normalizer(stats, 10000000))
    .then((stats) => {
      expect(stats.length).toBeGreaterThan(10)
      expect(stats[0]).toMatchObject({
        date: new Date("2020-03-03T00:00:00.000Z"),
        cases: {
          confirmed: {
            total: 4,
            perOneMillion: 0,
            today: 4,
            doublingTime: Infinity,
            growth: 0,
          },
          active: {
            total: 4
          },
          exposure: 2,
          imported: 2,
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
        hospitalization: {
          critical: 0,
          total: 0,
        }
      })
    })
  })

  it('gets 10th portuguese day', async () => {
    return insights(config.urls.insights['pt'].country)
    .then((stats) => normalizer(stats, 10000000))
    .then((stats) => {
      expect(stats[9]).toMatchObject({
        date: new Date("2020-03-12T00:00:00.000Z"),
        cases: {
          confirmed: {
            total: 78,
            perOneMillion: 8,
            today: 19,
            doublingTime: 2.580221279950221,
            growth: 0.3220338983,
          },
          active: {
            total: 78
          },
          exposure: 59,
          imported: 18,
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
        hospitalization: {
          critical: 0,
          total: 69,
        }
      })
    })
  })
})
