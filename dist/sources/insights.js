"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetcher_1 = __importDefault(require("../fetcher"));
const isNumeric_1 = __importDefault(require("../math/isNumeric"));
exports.default = (feed) => fetcher_1.default(feed, records => {
    const stats = records.map(({ Date: date, Confirmed, Exposure, Imported, Suspects, Surveillance, Recovered, Deaths, Hospitalized, Critical, NonConfirmed, Testing, Waiting, Chains, Reference }) => {
        const result = {
            cases: {
                confirmed: {
                    total: Number(Confirmed),
                }
            }
        };
        if (date !== undefined)
            result.date = new Date(date);
        if (Chains !== undefined)
            result.transmission = { knownChains: Number(Chains) };
        if (NonConfirmed !== undefined)
            result.cases.nonConfirmed = {
                total: Number(NonConfirmed),
            };
        if (Suspects !== undefined)
            result.cases.suspects = {
                total: Number(Suspects),
            };
        if (Deaths !== undefined && Recovered !== undefined)
            result.cases.active = {
                total: Number(Confirmed) - Number(Recovered) - Number(Deaths)
            };
        if (Imported !== undefined)
            result.cases.imported = {
                total: Number(Imported)
            };
        if (Exposure !== undefined)
            result.cases.exposure = {
                total: Number(Exposure)
            };
        if (Surveillance !== undefined)
            result.cases.surveillance = {
                total: Number(Surveillance)
            };
        if (Deaths !== undefined)
            result.deaths = {
                total: isNumeric_1.default(Deaths) ? Number(Deaths) : null,
            };
        if (Recovered !== undefined) {
            result.recovered = {
                total: isNumeric_1.default(Recovered) ? Number(Recovered) : null,
            };
        }
        if (Hospitalized !== undefined) {
            result.hospitalization = {
                total: isNumeric_1.default(Hospitalized) ? Number(Hospitalized) : null,
            };
            if (Critical !== undefined) {
                result.critical = {
                    total: isNumeric_1.default(Critical) ? Number(Critical) : null,
                };
            }
        }
        if (Testing !== undefined) {
            result.testing = {
                total: Number(Testing)
            };
            if (Waiting !== undefined) {
                result.testing.waiting = Number(Waiting);
            }
        }
        if (Reference)
            result.metadata = {
                sources: [
                    {
                        name: new URL(Reference).hostname.replace('www.', ''),
                        url: Reference
                    }
                ]
            };
        return result;
    });
    return stats;
});
//# sourceMappingURL=insights.js.map