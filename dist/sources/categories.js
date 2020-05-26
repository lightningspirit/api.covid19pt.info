"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetcher_1 = __importDefault(require("../fetcher"));
exports.default = (feed) => fetcher_1.default(feed, records => {
    return records.map(({ Id, TitlePt, TitleEn }) => ({
        id: Number(Id),
        name: {
            en: TitleEn,
            pt: TitlePt,
        }
    }));
});
//# sourceMappingURL=categories.js.map