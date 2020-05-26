"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.default = ({ url }) => node_fetch_1.default(url)
    .then(response => response.json())
    .then((records) => records
    .filter(({ countryInfo: { iso2 } }) => iso2)
    .map(({ country, countryInfo: { iso2, flag, lat, long, }, cases, deaths, recovered, active, critical, tests, testsPerOneMillion, casesPerOneMillion, deathsPerOneMillion, updated }) => ({
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
        testing: {
            total: tests,
            perOneMillion: testsPerOneMillion,
        },
        metadata: {
            sources: []
        }
    }
})));
//# sourceMappingURL=countries.js.map