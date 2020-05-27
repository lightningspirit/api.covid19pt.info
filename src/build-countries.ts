#!/usr/bin/env node

import { Config } from "./types";
import GetCountries from "./sources/countries";
import GetTimeline from "./sources/timeline";
import { Population, Stats, Event, Projection, Country } from "./api.types";
import normalizer from "./normalizer";
import GetCountryName from "./sources/countryName";
import { write, namespace } from "./data";
import { resource, collection } from "./responses/Hal";
import continentPt, { ContinentNames } from "./sources/continentPt";
import { merge } from "lodash"
import { program } from "commander"

const config: Config = require("../config.json");
const { version, name }: {[s:string]: any} = require("../package.json");

program
  .version(version)
  .option('-c, --countries <country>', 'comma-split country codes, otherwise all', 'all')
  .parse(process.argv)

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

  const normalizedCountries: Country[] = []

  await namespace('build')
  await namespace('build/countries')

  for (let country of countries) {
    const { info: { iso2 } } = country

    if (program.countries === "all" || (program.countries as string).toLowerCase().includes(iso2)) {

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
        const previous = country!.timeline![country.timeline!.length - 1]
        country.stats = merge(country.stats, previous)
      }
    }

    const thisCountryContinent = continents.find(({iso2: i2}) => i2 === iso2)

    if (thisCountryContinent) {
      country.info.continent = {
        en: thisCountryContinent.continent,
        pt: continentPt(thisCountryContinent.continent)
      }
    }

    country.info.name.pt = GetCountryName.pt(iso2) || country.info.name.en

    normalizedCountries.push({
      info: country.info, stats: country.stats
    })

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
  }

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
          critical: stats?.critical,
          testing: stats?.testing,
        }
      })
    })
  ))

  console.log('Saved Countries Index')

})()
