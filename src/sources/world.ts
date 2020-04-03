import fetch from "node-fetch";
import { NovelCovidWorldApiResponse } from "../types";
import { World, Population } from "../api.types";

export default ({ url, population }: { url: string, population: Population }): Promise<World> =>
  fetch(url)
    .then(response => response.json())
    .then(({
      cases, deaths, active, recovered, updated
    }: NovelCovidWorldApiResponse) => ({
      stats: {
        date: new Date(updated),
        cases: {
          confirmed: {
            total: cases
          },
          active: {
            total: active
          },
        },
        deaths: {
          total: deaths
        },
        recovered: {
          total: recovered
        },
        metadata: {
          sources: []
        }
      },
      population
    }))
