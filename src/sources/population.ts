import fetch from "node-fetch";
import { PopulationApiResponse } from "../types.d";
import { AgeGroups, Population } from "../api.types";
import { fromIso3 } from "./countryCode";
import { ContinentNames } from "./continentPt";

const populationSrc = require("./population.io.json");

const groupAge = (
  records: PopulationApiResponse[],
  min: number,
  max?: number
) =>
  records
    .filter(({ age }) => {
      if (age <= min) return false;
      if (max !== undefined) return age <= max;
      return true;
    })
    .reduce((g1, g2) => ({
      country: g1.country,
      total: g1.total + g2.total,
      females: g1.females + g2.females,
      males: g1.males + g2.males,
      year: g1.year,
      age: 0
    }));

export const single = ({
  url,
  name
}: {
  url: string
  name: string
}): Promise<Population> =>
  fetch(url.replace("{{name}}", name.replace(" ", "%20")))
  .then(response => response.json())
  .then((records: PopulationApiResponse[]) => {
    const combined = groupAge(records, 0);

    return {
      date: new Date(),
      everyone: {
        females: combined.females,
        males: combined.males,
        total: combined.total
      },
      groups: [
        {
          min: 0,
          max: 19,
          label: AgeGroups._0019
        },
        {
          min: 20,
          max: 39,
          label: AgeGroups._2039
        },
        {
          min: 40,
          max: 59,
          label: AgeGroups._4059
        },
        {
          min: 60,
          max: 79,
          label: AgeGroups._6079
        },
        {
          min: 80,
          label: AgeGroups._80
        }
      ].map(({ min, max, label }) => {
        const combined = groupAge(records, min, max);

        return {
          type: "age-group",
          label,
          females: combined.females,
          males: combined.males,
          total: combined.total
        };
      })
    }
  })

export default ({
  url
}: {
  url: string;
}): Promise<
  {
    population: Population;
    continent: keyof typeof ContinentNames;
    iso2: string;
  }[]
> =>
  Promise.all(
    populationSrc.map(
      ({
        GMI_CNTRY,
        POPIO_NAME,
        CONTINENT
      }: {
        GMI_CNTRY: string;
        POPIO_NAME: string;
        CONTINENT: string;
      }, index: number) => new Promise(resolve => {
        setTimeout(async () => {
          const result = await single({
            url, name: POPIO_NAME
          })

          resolve({
            iso2: fromIso3(GMI_CNTRY.toLowerCase()),
            continent: CONTINENT,
            population: result
          })
        }, 100 * index)
      })
    )
  );
