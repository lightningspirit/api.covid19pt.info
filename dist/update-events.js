"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("./sources/events"));
const categories_1 = __importDefault(require("./sources/categories"));
const data_1 = require("./data");
const config = require("../config.json");
(async () => {
    console.log('Retrieving Events');
    const events = await events_1.default(config.urls.events);
    await data_1.namespace(`data`);
    await data_1.write('data/events', events);
    console.log('Saved Events');
    console.log('Retrieving Event Categories');
    const categories = await categories_1.default(config.urls.categories);
    await data_1.write('data/categories', categories);
    console.log('Saved Event Categories');
})();
//# sourceMappingURL=update-events.js.map