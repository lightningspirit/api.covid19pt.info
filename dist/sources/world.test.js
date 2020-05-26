"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const world_1 = __importDefault(require("./world"));
const config = require('../../config.json');
const { world: population } = require("../../data/population.json");
describe('world', () => {
    it('fetches and parses successfully', async () => {
        return world_1.default({
            url: config.urls.world,
            population
        })
            .then((world) => {
            expect(world.stats.date).toBeInstanceOf(Date);
            expect(world.stats.cases.active.total).toBeGreaterThan(1);
            expect(world.stats.cases.confirmed.total).toBeGreaterThan(1);
            expect(world.stats.deaths.total).toBeGreaterThan(1);
            expect(world.stats.recovered.total).toBeGreaterThan(1);
        });
    });
});
//# sourceMappingURL=world.test.js.map