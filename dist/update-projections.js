"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const projections_1 = __importDefault(require("./sources/projections"));
const data_1 = require("./data");
const config = require("../config.json");
(async () => {
    console.log('Retrieving Projections');
    Object.keys(config.urls.projections).forEach(async (iso2) => {
        console.log(`Retrieving ${iso2.toUpperCase()} Projections`);
        let projections = await projections_1.default(config.urls.projections[iso2]);
        await data_1.namespace(`data`);
        await data_1.namespace(`data/projections`);
        await data_1.write(`data/projections/${iso2}`, projections);
        console.log(`Saved ${iso2.toUpperCase()} Projections`);
    });
})();
//# sourceMappingURL=update-projections.js.map