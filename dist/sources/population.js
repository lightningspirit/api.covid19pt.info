"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const api_types_1 = require("../api.types");
const countryCode_1 = require("./countryCode");
const populationSrc = require("../../population.io.json");
const groupAge = (records, min, max) => records
    .filter(({ age }) => {
    if (age <= min)
        return false;
    if (max !== undefined)
        return age <= max;
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
exports.single = ({ url, name }) => node_fetch_1.default(url.replace("{{name}}", name.replace(" ", "%20")))
    .then(response => response.json())
    .then((records) => {
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
                label: api_types_1.AgeGroups._0019
            },
            {
                min: 20,
                max: 39,
                label: api_types_1.AgeGroups._2039
            },
            {
                min: 40,
                max: 59,
                label: api_types_1.AgeGroups._4059
            },
            {
                min: 60,
                max: 79,
                label: api_types_1.AgeGroups._6079
            },
            {
                min: 80,
                label: api_types_1.AgeGroups._80
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
    };
});
exports.default = ({ url }) => Promise.all(populationSrc.map(({ GMI_CNTRY, POPIO_NAME, CONTINENT }, index) => new Promise(resolve => {
    setTimeout(async () => {
        const result = await exports.single({
            url, name: POPIO_NAME
        });
        resolve({
            iso2: countryCode_1.fromIso3(GMI_CNTRY.toLowerCase()),
            continent: CONTINENT,
            population: result
        });
    }, 100 * index);
})));
//# sourceMappingURL=population.js.map