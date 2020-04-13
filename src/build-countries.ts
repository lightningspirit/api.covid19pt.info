import { Config } from "./types";
import GetCountries from "./sources/countries";
import GetEvents from "./sources/events"
import GetTimeline from "./sources/timeline";
import GetProjections from "./sources/projections"
import { Population, Stats, Event, Projection } from "./api.types";
import normalizer from "./normalizer";
import GetCountryName from "./sources/countryName";
import { write, namespace } from "./data";
import { resource, collection } from "./responses/Hal";
import continentPt, { ContinentNames } from "./sources/continentPt";

const config: Config = require("../config.json");

const {
  countries: population
}: {
  world: Population
  countries: {
    iso2: string
    population: Population
  }[]
} = require("../data/population.json");

const events = (require(`../data/events.json`) as Event[])
  .map(({date, ...all}) => ({
    date: date ? new Date(date) : undefined,
    ...all
  }))

const continents: {
  iso2: string
  continent: keyof typeof ContinentNames
}[] = require("../data/continents.json");

(async () => {
  console.log('Retrieving Countries')

  const countries = await GetCountries({
    url: config.urls.countries
  })

  const normalizedCountries = await Promise.all(countries.map(async country => {
    const { info: { iso2 } } = country

    console.log(`Retrieving ${country.info.name.en} Timeline`)

    if (config.urls.insights[iso2]) {
      country.timeline = (require(`../data/insights/${iso2}/timeline`) as Stats[])
        .map(({date, ...all}) => ({
          date: date ? new Date(date) : undefined,
          ...all
        }))

    } else {
      country.timeline = await GetTimeline(config.urls.historical, iso2)
    }

    country.timeline = country.timeline.map((stats) => {
      // TODO: Find a way to calculate this
      /*if (stats.groups && stats.groups.length >  0) {
        stats.groups = normalizer(stats.groups, [
          'cases.confirmed',
          'recovered',
          'deaths',
        ], {
          enableToday: true,
          enableGrowth: true,
        })
      }*/

      return ({
        ...stats,
        events: events.filter(({country, date}) => country?.iso2 === iso2 && date?.getTime() === stats.date?.getTime()).map(event => {
          delete event.date
          delete event.country
          return event
        }),
      })
    })

    if (config.urls.projections[iso2]) {
      console.log(`Retrieving ${country.info.name.en} Projections`)
      country.projections = (require(`../data/projections/${iso2}.json`) as Projection[])
        .map(({date, ...all}) => ({
          date: new Date(date),
          ...all
        }))
    }

    const countryPopulation = population.find(({iso2:i2}) => i2 === iso2)

    country.timeline = normalizer(country.timeline, [
      'cases.confirmed',
    ], {
      enableDoublingTime: true,
    })

    country.timeline = normalizer(country.timeline, [
      'cases.confirmed',
      'cases.suspects',
      'cases.surveillance',
      'cases.active',
      'cases.exposure',
      'cases.imported',
      'recovered',
      'deaths',
      'hospitalization',
      'critical',
      'testing',
    ], {
      enableGrowth: true,
    })

    country.timeline = normalizer(country.timeline, [
      'cases.confirmed',
      'cases.active',
      'recovered',
      'deaths',
      'hospitalization',
      'critical',
      'testing',
    ], {
      enableToday: true,
    })

    if (countryPopulation) {
      country.population = countryPopulation.population
      country.timeline = normalizer(country.timeline, [
        'cases.confirmed',
        'cases.active',
        'recovered',
        'deaths',
        'testing',
        'hospitalization',
      ], {
        enablePerOneMillion: true,
      }, country.population.everyone.total)
    }

    country.timeline = normalizer(country.timeline, [
      'cases.confirmed',
      'cases.active',
      'recovered',
      'deaths',
      'hospitalization',
      'critical',
      'testing',
    ], {
      enable5dayAvg: true,
    })

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

  await namespace('build')
  await namespace('build/countries')

  await write(`build/countries/index`, collection(
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

  await namespace('build/countries')

  normalizedCountries.forEach(async country => {
    await namespace(`build/countries/${country.info.iso2}`)
    await write(`build/countries/${country.info.iso2}/index`, resource(
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

    await namespace(`build/countries/${country.info.iso2}/timeline`)

    await write(`build/countries/${country.info.iso2}/timeline/index`, collection(
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
