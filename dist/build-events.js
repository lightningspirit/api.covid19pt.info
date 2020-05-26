"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hal_1 = require("./responses/Hal");
const data_1 = require("./data");
const config = require("../config.json");
const events = require(`../data/events.json`)
    .map(({ date, ...all }) => ({
    date: date ? new Date(date) : undefined,
    ...all
}));
(async () => {
    console.log('Retrieving Event Categories');
    await data_1.namespace(`build/events`);
    await data_1.write('build/events/index', Hal_1.collection("Events Timeline for all countries", {
        self: {
            title: "Events Timeline",
            href: `${config.apiUrl}/events/`
        },
        parent: {
            href: `${config.apiUrl}/`,
        }
    }, events));
    console.log('Saved Events');
})();
//# sourceMappingURL=build-events.js.map