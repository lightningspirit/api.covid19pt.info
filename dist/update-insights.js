"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const insights_1 = __importDefault(require("./sources/insights"));
const lodash_1 = require("lodash");
const data_1 = require("./data");
const config = require("../config.json");
(async () => {
    console.log('Retrieving Insights');
    Object.keys(config.urls.insights).forEach(async (iso2) => {
        console.log(`Retrieving ${iso2.toUpperCase()} Timeline`);
        let timeline = await insights_1.default(config.urls.insights[iso2].country);
        if (config.urls.insights[iso2].groups) {
            console.log(`Retrieving ${iso2.toUpperCase()} Groups`);
            const groups = lodash_1.flatten(await Promise.all(config.urls.insights[iso2].groups.map(async ({ type, label, feed }) => {
                return (await insights_1.default(feed)).map(stats => ({
                    type,
                    label,
                    ...stats
                }));
            })));
            timeline = timeline.map((stats) => {
                return ({
                    ...stats,
                    groups: groups.filter(({ date }) => { var _a, _b; return ((_a = date) === null || _a === void 0 ? void 0 : _a.getTime()) === ((_b = stats.date) === null || _b === void 0 ? void 0 : _b.getTime()); }).map(group => {
                        delete group.date;
                        return group;
                    })
                });
            });
        }
        await data_1.namespace(`data`);
        await data_1.namespace(`data/insights`);
        await data_1.namespace(`data/insights/${iso2}`);
        await data_1.write(`data/insights/${iso2}/timeline`, timeline);
        console.log(`Saved ${iso2.toUpperCase()} Timeline`);
    });
})();
//# sourceMappingURL=update-insights.js.map