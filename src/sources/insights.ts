import { InsightsApiResponse, Feed } from "../types";
import fetcher from "../fetcher";
import { Stats, Localized } from "../api.types";
import isNumeric from "../math/isNumeric";

export interface Historical {
  info: {
    code: string;
    name: Localized;
  };
  timeline: Stats[];
}

export default (feed: Feed) =>
  fetcher<InsightsApiResponse[], Stats[]>(feed, records => {
    const stats = records.map(({
      Date: date,
      Confirmed,
      Exposure,
      Imported,
      Suspects,
      Surveillance,
      Recovered,
      Deaths,
      Hospitalized,
      Critical,
      NonConfirmed,
      Testing,
      Waiting,
      Chains,
      Reference
    }) => {

      const result: Stats = {
        cases: {
          confirmed: {
            total: Number(Confirmed),
          }
        }
      }

      if (date !== undefined)
        result.date = new Date(date)

      if (Chains !== undefined)
        result.transmission = { knownChains: Number(Chains) }

      if (NonConfirmed !== undefined)
        result.cases.nonConfirmed = {
          total: Number(NonConfirmed),
        }

      if (Suspects !== undefined)
        result.cases.suspects = {
          total: Number(Suspects),
        }

      if (Deaths !== undefined && Recovered !== undefined)
        result.cases.active = {
          total: Number(Confirmed) - Number(Recovered) - Number(Deaths)
        }

      if (Imported !== undefined)
        result.cases.imported = {
          total: Number(Imported)
        }

      if (Exposure !== undefined)
        result.cases.exposure = {
          total: Number(Exposure)
        }

      if (Surveillance !== undefined)
        result.cases.surveillance = {
          total: Number(Surveillance)
        }

      if (Deaths !== undefined)
        result.deaths = {
          total: isNumeric(Deaths) ? Number(Deaths) : null,
        }

      if (Recovered !== undefined) {
        result.recovered = {
          total: isNumeric(Recovered) ? Number(Recovered) : null,
        }
      }

      if (Hospitalized !== undefined) {
        result.hospitalization = {
          total: isNumeric(Hospitalized) ? Number(Hospitalized) : null,
        }

        if (Critical !== undefined) {
          result.critical = {
            total: isNumeric(Critical) ? Number(Critical) : null,
          }
        }
      }

      if (Testing !== undefined) {
        result.testing = {
          total: Number(Testing)
        }

        if (Waiting !== undefined) {
          result.testing.waiting = Number(Waiting)
        }
      }

      if (Reference)
        result.metadata = {
          sources: [
            {
              name: new URL(Reference).hostname.replace('www.', ''),
              url: Reference
            }
          ]
        }

      return result
    })

    return stats
  })
