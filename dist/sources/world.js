"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.default = ({ url, population }) => node_fetch_1.default(url)
    .then(response => response.json())
    .then(({ cases, todayCases, casesPerOneMillion, deaths, todayDeaths, deathsPerOneMillion, critical, active, recovered, tests, testsPerOneMillion, affectedCountries, updated }) => ({
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
}));
//# sourceMappingURL=world.js.map