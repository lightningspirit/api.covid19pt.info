"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const population_1 = require("./population");
const config = require('../../config.json');
describe('population', () => {
    it('fetches and parses successfully', async () => {
        return population_1.single({
            url: config.urls.population, name: 'World'
        })
            .then((records) => {
            expect(records.everyone.females).toBeGreaterThan(100000);
            expect(records.everyone.males).toBeGreaterThan(100000);
            expect(records.everyone.total).toBeGreaterThan(100000);
            expect(records.groups.length).toBe(5);
        });
    });
});
//# sourceMappingURL=population.test.js.map