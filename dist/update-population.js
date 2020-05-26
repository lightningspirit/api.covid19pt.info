"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const population_1 = __importStar(require("./sources/population"));
const data_1 = require("./data");
const config = require("../config.json");
(async () => {
    console.log('Retrieving World Population');
    const world = await population_1.single({
        url: config.urls.population,
        name: "World"
    });
    console.log(`Retrieving Countries Population`);
    const population = [];
    const continent = [];
    (await population_1.default({
        url: config.urls.population,
    })).forEach(({ population: p, continent: c, iso2 }) => {
        population.push({
            iso2, population: p
        });
        continent.push({
            iso2, continent: c
        });
    });
    await data_1.namespace(`data`);
    await data_1.write(`data/population`, {
        world,
        countries: population
    });
    console.log('Saved Population');
    await data_1.write(`data/continents`, continent);
    console.log('Saved Continents');
})();
//# sourceMappingURL=update-population.js.map