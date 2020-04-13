import fetch from "node-fetch";
import { NovelCovidWorldApiResponse } from "../types";
import { World, Population } from "../api.types";

export default ({ url, population }: { url: string, population: Population }): Promise<World> =>
  fetch(url)
    .then(response => response.json())
    .then(({
      cases, todayCases, casesPerOneMillion, deaths, todayDeaths, deathsPerOneMillion, critical, active, recovered, tests, testsPerOneMillion, affectedCountries, updated
    }: NovelCovidWorldApiResponse) => ({
      stats: {
        date: new Date(updated),
        cases: {
          confirmed: {
            total: cases,
            today: todayCases,
            perOneMillion: casesPerOneMillion,
          },
          active: {
            total: active,
          },
        },
        deaths: {
          total: deaths,
          today: todayDeaths,
          perOneMillion: deathsPerOneMillion,
        },
        recovered: {
          total: recovered,
        },
        critical: {
          total: critical,
        },
        testing: {
          total: tests,
          perOneMillion: testsPerOneMillion,
        },
        affectedCountries,
        metadata: {
          sources: []
        }
      },
      population
    }))
