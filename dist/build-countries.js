#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const countries_1 = __importDefault(require("./sources/countries"));
const timeline_1 = __importDefault(require("./sources/timeline"));
const normalizer_1 = __importDefault(require("./normalizer"));
const countryName_1 = __importDefault(require("./sources/countryName"));
const data_1 = require("./data");
const Hal_1 = require("./responses/Hal");
const continentPt_1 = __importDefault(require("./sources/continentPt"));
const lodash_1 = require("lodash");
const commander_1 = require("commander");
const config = require("../config.json");
const { version, name } = require("../package.json");
commander_1.program
    .version(version)
    .option('-c, --countries <country>', 'comma-split country codes, otherwise all', 'all')
    .parse(process.argv);
const { countries: population } = require("../data/population.json");
const events = require(`../data/events.json`)
    .map(({ date, ...all }) => ({
    date: date ? new Date(date) : undefined,
    ...all
}));
const continents = require("../data/continents.json");
(async () => {
    console.log('Retrieving Countries');
    const countries = await countries_1.default({
        url: config.urls.countries
    });
    const normalizedCountries = [];
    await data_1.namespace('build');
    await data_1.namespace('build/countries');
    for (let country of countries) {
        const { info: { iso2 } } = country;
        if (commander_1.program.countries === "all" || commander_1.program.countries.toLowerCase().includes(iso2)) {
            console.log(`Retrieving ${country.info.name.en} Timeline`);
            if (config.urls.insights[iso2]) {
                country.timeline = require(`../data/insights/${iso2}/timeline`)
                    .map(({ date, ...all }) => ({
                    date: date ? new Date(date) : undefined,
                    ...all
                }));
            }
            else {
                country.timeline = await timeline_1.default(config.urls.historical, iso2);
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
                    events: events.filter(({ country, date }) => { var _a, _b, _c; return ((_a = country) === null || _a === void 0 ? void 0 : _a.iso2) === iso2 && ((_b = date) === null || _b === void 0 ? void 0 : _b.getTime()) === ((_c = stats.date) === null || _c === void 0 ? void 0 : _c.getTime()); }).map(event => {
                        delete event.date;
                        delete event.country;
                        return event;
                    }),
                });
            });
            if (config.urls.projections[iso2]) {
                console.log(`Retrieving ${country.info.name.en} Projections`);
                country.projections = require(`../data/projections/${iso2}.json`)
                    .map(({ date, ...all }) => ({
                    date: new Date(date),
                    ...all
                }));
            }
            const countryPopulation = population.find(({ iso2: i2 }) => i2 === iso2);
            country.timeline = normalizer_1.default(country.timeline, [
                'cases.confirmed',
            ], {
                enableDoublingTime: true,
            });
            country.timeline = normalizer_1.default(country.timeline, [
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
            });
            country.timeline = normalizer_1.default(country.timeline, [
                'cases.confirmed',
                'cases.active',
                'recovered',
                'deaths',
                'hospitalization',
                'critical',
                'testing',
            ], {
                enableToday: true,
            });
            if (countryPopulation) {
                country.population = countryPopulation.population;
                country.timeline = normalizer_1.default(country.timeline, [
                    'cases.confirmed',
                    'cases.active',
                    'recovered',
                    'deaths',
                    'testing',
                    'hospitalization',
                ], {
                    enablePerOneMillion: true,
                }, country.population.everyone.total);
            }
            country.timeline = normalizer_1.default(country.timeline, [
                'cases.confirmed',
                'cases.active',
                'recovered',
                'deaths',
                'hospitalization',
                'critical',
                'testing',
            ], {
                enable5dayAvg: true,
            });
            if (country.timeline.length > 0) {
                const previous = country.timeline[country.timeline.length - 1];
                country.stats = lodash_1.merge(country.stats, previous);
            }
        }
        const thisCountryContinent = continents.find(({ iso2: i2 }) => i2 === iso2);
        if (thisCountryContinent) {
            country.info.continent = {
                en: thisCountryContinent.continent,
                pt: continentPt_1.default(thisCountryContinent.continent)
            };
        }
        country.info.name.pt = countryName_1.default.pt(iso2) || country.info.name.en;
        normalizedCountries.push({
            info: country.info, stats: country.stats
        });
        await data_1.namespace(`build/countries/${country.info.iso2}`);
        await data_1.write(`build/countries/${country.info.iso2}/index`, Hal_1.resource(country.info.name.en, {
            self: {
                href: `${config.apiUrl}/countries/${country.info.iso2}/`
            },
            timeline: {
                href: `${config.apiUrl}/countries/${country.info.iso2}/timeline/`
            },
            parent: {
                href: `${config.apiUrl}/countries/`
            }
        }, {
            info: country.info,
            stats: country.stats,
            population: country.population,
            projections: country.projections,
        }));
        await data_1.namespace(`build/countries/${country.info.iso2}/timeline`);
        await data_1.write(`build/countries/${country.info.iso2}/timeline/index`, Hal_1.collection(undefined, {
            self: {
                href: `${config.apiUrl}/countries/${country.info.iso2}/timeline/`
            },
            parent: {
                href: `${config.apiUrl}/countries/${country.info.iso2}/`
            }
        }, country.timeline));
        console.log(`Saved ${country.info.name.en}`);
    }
    await data_1.write(`build/countries/index`, Hal_1.collection("Current Countries Statistics", {
        self: {
            href: `${config.apiUrl}/countries/`
        },
        country: {
            templated: true,
            href: `${config.apiUrl}/countries/{iso2}/`
        }
    }, normalizedCountries.map(({ info, stats }) => {
        var _a, _b, _c, _d, _e;
        return Hal_1.resource(undefined, {
            self: {
                href: `${config.apiUrl}/countries/${info.iso2}/`
            },
        }, {
            info,
            stats: {
                cases: (_a = stats) === null || _a === void 0 ? void 0 : _a.cases,
                deaths: (_b = stats) === null || _b === void 0 ? void 0 : _b.deaths,
                recovered: (_c = stats) === null || _c === void 0 ? void 0 : _c.recovered,
                critical: (_d = stats) === null || _d === void 0 ? void 0 : _d.critical,
                testing: (_e = stats) === null || _e === void 0 ? void 0 : _e.testing,
            }
        });
    })));
    console.log('Saved Countries Index');
})();
//# sourceMappingURL=build-countries.js.map