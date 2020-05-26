"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const world_1 = __importDefault(require("./sources/world"));
const Hal_1 = require("./responses/Hal");
const data_1 = require("./data");
const world_timeline_1 = __importDefault(require("./sources/world-timeline"));
const normalizer_1 = __importDefault(require("./normalizer"));
const config = require("../config.json");
const population = require("../data/population.json");
(async () => {
    console.log('Retrieving World Population');
    console.log('Retrieving World Stats');
    const world = await world_1.default({
        url: config.urls.world,
        population: population.world
    });
    world.stats = normalizer_1.default([world.stats], [
        'cases.confirmed',
        'cases.active',
        'recovered',
        'deaths',
        'critical',
        'testing',
    ], {
        enablePerOneMillion: true
    }, population.world.everyone.total)[0];
    let timeline = await world_timeline_1.default(config.urls.historical, 'all');
    timeline = normalizer_1.default(timeline, [
        'cases.confirmed',
    ], {
        enableDoublingTime: true,
    });
    timeline = normalizer_1.default(timeline, [
        'cases.confirmed',
        'cases.active',
        'recovered',
        'deaths',
    ], {
        enableGrowth: true,
    });
    timeline = normalizer_1.default(timeline, [
        'cases.confirmed',
        'cases.active',
        'recovered',
        'deaths',
        'critical',
    ], {
        enableToday: true,
    });
    timeline = normalizer_1.default(timeline, [
        'cases.confirmed',
        'cases.active',
        'recovered',
        'deaths',
        'critical',
    ], {
        enable5dayAvg: true,
    });
    await data_1.namespace(`build`);
    await data_1.write('build/index', Hal_1.resource("Current World Statistics", {
        self: {
            title: "Current World Statistics",
            href: `${config.apiUrl}/`
        },
        timeline: {
            title: "World Statistics Timeline",
            href: `${config.apiUrl}/timeline/`
        },
        events: {
            title: "Events Timeline",
            href: `${config.apiUrl}/events/`
        },
        categories: {
            title: "Event Categories",
            href: `${config.apiUrl}/categories/`
        },
        countries: {
            title: "Current Countries Statistics",
            href: `${config.apiUrl}/countries/`
        }
    }, world));
    await data_1.namespace(`build/timeline`);
    await data_1.write('build/timeline/index', Hal_1.collection("World Timeline", {
        self: {
            title: "World Timeline",
            href: `${config.apiUrl}/timeline/`
        },
        parent: {
            href: `${config.apiUrl}/`
        }
    }, timeline));
    console.log('Saved World');
})();
//# sourceMappingURL=build-world.js.map