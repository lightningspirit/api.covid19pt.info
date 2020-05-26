"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetcher_1 = __importDefault(require("../fetcher"));
exports.default = (feed, iso2) => {
    return fetcher_1.default(feed, (timeline) => {
        return timeline
            ? Object.keys(timeline.cases).map(date => {
                return ({
                    date: new Date(date),
                    cases: {
                        confirmed: {
                            total: timeline.cases[date]
                        }
                    },
                    deaths: {
                        total: timeline.deaths[date]
                    },
                    recovered: {
                        total: timeline.recovered[date]
                    },
                });
            })
            : [];
    }, {
        iso2
    });
};
//# sourceMappingURL=world-timeline.js.map