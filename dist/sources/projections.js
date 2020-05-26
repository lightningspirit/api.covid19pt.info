"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const fetcher_1 = __importDefault(require("../fetcher"));
exports.default = (feed) => fetcher_1.default(feed, records => {
    const ByProjection = lodash_1.groupBy(records, 'ProjectionDate');
    const ProjectionDates = Object.keys(ByProjection);
    return ProjectionDates.map((ThisProjectionDate) => ({
        date: new Date(ThisProjectionDate),
        nodes: ByProjection[ThisProjectionDate]
            .map(({ Date: date, Max, Min }) => ({
            date: new Date(date),
            max: Number(Max),
            min: Number(Min)
        }))
    }));
});
//# sourceMappingURL=projections.js.map