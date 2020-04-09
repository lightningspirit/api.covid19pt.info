import fetch from "node-fetch";
import { NovelCovidCountriesApiResponse } from "../types";
import { Country } from "../api.types";

export default ({ url }: { url: string }): Promise<Country[]> =>
  fetch(url)
    .then(response => response.json())
    .then((records: NovelCovidCountriesApiResponse[]) =>
      records
      .filter(({countryInfo: {iso2}}) => iso2)
      .map(({
        country,
        countryInfo: {
          iso2,
          flag,
          lat,
          long,
        },
        cases,
        deaths,
        recovered,
        active,
        critical,
        casesPerOneMillion,
        deathsPerOneMillion,
        updated
      }) => ({
        info: {
          iso2: iso2.toLowerCase(),
          name: {
            en: country,
          },
          flag,
          coordinates: {
            latitude: lat,
            longitude: long,
          }
        },
        stats: {
          date: new Date(updated),
          cases: {
            confirmed: {
              total: cases,
              perOneMillion: casesPerOneMillion
            },
            active: {
              total: active
            },
          },
          deaths: {
            total: deaths,
            perOneMillion: deathsPerOneMillion,
          },
          recovered: {
            total: recovered,
          },
          hospitalization: {
            total: 0,
          },
          critical: {
            total: critical,
          },
          metadata: {
            sources: []
          }
        }
      })
    ))
