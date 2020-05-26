"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetcher_1 = __importDefault(require("../fetcher"));
exports.default = (feed) => fetcher_1.default(feed, records => {
    return records.map(({ Date: date, EventEn, EventPt, Type, Country, Source }) => ({
        date: new Date(date),
        title: {
            pt: EventPt,
            en: EventEn,
        },
        category: {
            id: Number(Type)
        },
        country: {
            iso2: Country.toLowerCase()
        },
        source: Source ? {
            name: new URL(Source).hostname.replace('www.', ''),
            url: Source,
        } : null
    }));
});
//# sourceMappingURL=events.js.map