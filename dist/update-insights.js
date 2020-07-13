"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const insights_1 = __importDefault(require("./sources/insights"));
const data_1 = require("./data");
const fetcher_1 = __importDefault(require("./fetcher"));
const config = require("../config.json");
(async () => {
    console.log('Retrieving Insights');
    Object.keys(config.urls.insights).forEach(async (iso2) => {
        console.log(`Retrieving ${iso2.toUpperCase()} Timeline`);
        let timeline = await insights_1.default(config.urls.insights[iso2].country);
        let testing = await fetcher_1.default(config.urls.insights[iso2].testing, records => {
            return records.map(({ data, amostras, }) => {
                return ({
                    date: new Date(data.split('-').reverse().join('-')),
                    testing: {
                        total: Number(amostras)
                    }
                });
            });
        });
        timeline.forEach(({ date }, index) => {
            const pindex = testing.findIndex(({ date: pdate }) => { var _a; return ((_a = date) === null || _a === void 0 ? void 0 : _a.getTime()) === pdate.getTime(); });
            if (pindex === -1 && index > 0)
                timeline[index] = {
                    ...timeline[index],
                    testing: {
                        ...timeline[index].testing,
                        total: timeline[index - 1].testing && timeline[index].cases.suspects && timeline[index - 1].cases.suspects
                            // @ts-ignore
                            ? timeline[index - 1].testing.total + timeline[index].cases.suspects.total - timeline[index - 1].cases.suspects.total
                            : timeline[index - 1].testing
                                // @ts-ignore
                                ? timeline[index - 1].testing.total
                                : 0
                    }
                };
            else
                timeline[index] = {
                    ...timeline[index],
                    testing: {
                        ...timeline[index].testing,
                        ...testing[pindex].testing
                    }
                };
        });
        /*if (config.urls.insights[iso2].groups) {
          console.log(`Retrieving ${iso2.toUpperCase()} Groups`)
    
          const groups = flatten(await Promise.all(config.urls.insights[iso2].groups!.map(async ({
            type, label, feed
          }) => {
            return (await GetInsights(feed)).map(stats => ({
            type,
            label,
            ...stats
          }))})))
    
          timeline = timeline.map((stats) => {
            return ({
              ...stats,
              groups: groups.filter(({date}) => date?.getTime() === stats.date?.getTime()).map(group => {
                delete group.date
                return group
              })
            })
          })
        }*/
        await data_1.namespace(`data`);
        await data_1.namespace(`data/insights`);
        await data_1.namespace(`data/insights/${iso2}`);
        await data_1.write(`data/insights/${iso2}/timeline`, timeline);
        console.log(`Saved ${iso2.toUpperCase()} Timeline`);
    });
})();
//# sourceMappingURL=update-insights.js.map