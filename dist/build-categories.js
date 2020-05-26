"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hal_1 = require("./responses/Hal");
const data_1 = require("./data");
const config = require("../config.json");
const categories = require(`../data/categories.json`);
(async () => {
    console.log('Retrieving Event Categories');
    await data_1.namespace(`build`);
    await data_1.namespace(`build/categories`);
    await data_1.write('build/categories/index', Hal_1.collection("Event Categories", {
        self: {
            title: "Event Categories",
            href: `${config.apiUrl}/categories/`
        },
        events: {
            title: "Events Timeline",
            href: `${config.apiUrl}/events/`
        }
    }, categories));
    console.log('Saved Event Categories');
})();
//# sourceMappingURL=build-categories.js.map