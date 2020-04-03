import { Config } from "./types";
import GetCountries from "./sources/countries";
import GetEvents from "./sources/events"
import GetInsights from "./sources/insights";
import GetTimeline from "./sources/timeline";
import GetProjections from "./sources/projections"
import { Population } from "./api.types";
import { flatten } from "lodash"
import normalizer from "./normalizer";
import GetCountryName from "./sources/countryName";
import { write, namespace } from "./data";
import { resource, collection } from "./responses/Hal";
import continentPt, { ContinentNames } from "./sources/continentPt";

const config: Config = require("./config.json");
const {
  countries: population
}: {
  world: Population
  countries: {
    iso2: string
    population: Population
  }[]
} = require("../data/population.json");
const continents: {
  iso2: string
  continent: keyof typeof ContinentNames
}[] = require("../data/continents.json");

(async () => {
  console.log('Retrieving Countries')

  const countries = await GetCountries({
    url: config.urls.countries
  })

  console.log('Retrieving Events')

  const events = await GetEvents(config.urls.events)

  const normalizedCountries = await Promise.all(countries.map(async country => {
    const { info: { iso2 } } = country

    console.log(`Retrieving ${country.info.name.en} Timeline`)

    if (config.urls.insights[iso2]) {
      country.timeline = await GetInsights(config.urls.insights[iso2].country)

      if (config.urls.insights[iso2].groups) {
        console.log(`Retrieving ${country.info.name.en} Groups`)

        const groups = flatten(await Promise.all(config.urls.insights[iso2].groups!.map(async ({
          type, label, feed
        }) => (await GetInsights(feed)).map(stats => ({
          type,
          label,
          ...stats
        })))))

        country.timeline = country.timeline.map((stats) => ({
          ...stats,
          groups: groups.filter(({date}) => date?.getTime() === stats.date?.getTime()).map(group => {
            delete group.date
            return group
          })
        }))
      }

    } else {
      country.timeline = await GetTimeline(config.urls.historical, iso2)
    }

    country.timeline = country.timeline.map((stats) => ({
      ...stats,
      events: events.filter(({country, date}) => country?.iso2 === iso2 && date?.getTime() === stats.date?.getTime()).map(event => {
        delete event.date
        delete event.country
        return event
      }),
    }))

    if (config.urls.projections[iso2]) {
      console.log(`Retrieving ${country.info.name.en} Projections`)
      country.projections = await GetProjections(config.urls.projections[iso2])
    }

    const countryPopulation = population.find(({iso2:i2}) => i2 === iso2)

    if (countryPopulation) {
      country.population = countryPopulation.population
      country.timeline = normalizer(country.timeline, country.population.everyone.total)
    }

    if (country.timeline.length > 0) {
      country.stats = country.timeline[country.timeline.length - 1]
    }

    const thisCountryContinent = continents.find(({iso2: i2}) => i2 === iso2)

    if (thisCountryContinent) {
      country.info.continent = {
        en: thisCountryContinent.continent,
        pt: continentPt(thisCountryContinent.continent)
      }
    }

    country.info.name.pt = GetCountryName.pt(iso2) || country.info.name.en

    return country
  }))

  await write(`countries`, collection(
    "Current Countries Statistics",
    {
      self: {
        href: `${config.apiUrl}/countries/`
      },
      country: {
        templated: true,
        href: `${config.apiUrl}/countries/{iso2}/`
      }
    },
    normalizedCountries.map(({
      info, stats
    }) => {
      return resource(undefined, {
        self: {
          href: `${config.apiUrl}/countries/${info.iso2}/`
        },
      }, {
        info,
        stats: {
          cases: stats?.cases,
          deaths: stats?.deaths,
          recovered: stats?.recovered,
        }
      })
    })
  ))

  console.log('Saved Countries Index')

  await namespace('countries')

  normalizedCountries.forEach(async country => {
    await write(`countries/${country.info.iso2}`, resource(
      country.info.name.en,
      {
        self: {
          href: `${config.apiUrl}/countries/${country.info.iso2}/`
        },
        timeline: {
          href: `${config.apiUrl}/countries/${country.info.iso2}/timeline/`
        },
        parent: {
          href: `${config.apiUrl}/countries/`
        }
      },
      {
        info: country.info,
        stats: country.stats,
        population: country.population,
        projections: country.projections,
      }
    ))

    await namespace(`countries/${country.info.iso2}`)

    await write(`countries/${country.info.iso2}/timeline`, collection(
      undefined,
      {
        self: {
          href: `${config.apiUrl}/countries/${country.info.iso2}/timeline/`
        },
        parent: {
          href: `${config.apiUrl}/countries/${country.info.iso2}/`
        }
      },
      country.timeline
    ))

    console.log(`Saved ${country.info.name.en}`)
  })

})()
