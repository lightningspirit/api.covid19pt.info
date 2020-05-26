"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ZeroOrPositive_1 = __importDefault(require("../math/ZeroOrPositive"));
const DoublingTime_1 = __importDefault(require("../math/DoublingTime"));
const lodash_1 = require("lodash");
const Average_1 = __importDefault(require("../math/Average"));
const Growth_1 = __importDefault(require("../math/Growth"));
const PerMillionOfPopulation_1 = __importDefault(require("../math/PerMillionOfPopulation"));
exports.default = (stats, metrics = [
    'cases.confirmed',
], { enablePerOneMillion = false, enableToday = false, enableGrowth = false, enableDoublingTime = false, enable5dayAvg = false, }, population) => {
    if (enablePerOneMillion && !population) {
        throw new Error('enablePerOneMillion needs population to be filled');
    }
    const growths = [];
    const averages = [];
    const averagesTodays = [];
    const doublingTime = [];
    const perOneMillion = [];
    const today = [];
    stats.forEach((record, index) => {
        const previousFour = ZeroOrPositive_1.default(index - 4);
        const previousOne = ZeroOrPositive_1.default(index - 1);
        growths[index] = {};
        averages[index] = {};
        averagesTodays[index] = {};
        doublingTime[index] = {};
        perOneMillion[index] = {};
        today[index] = {};
        metrics.forEach(key => {
            const previousRecord = stats[previousOne];
            const totalKey = `${key}.total`;
            const todayKey = `${key}.today`;
            const thisValue = lodash_1.get(record, totalKey);
            const previousValue = lodash_1.get(previousRecord, totalKey);
            // @ts-ignore
            growths[index][key] = previousValue ? Growth_1.default(Number(previousValue), Number(thisValue)) : 0;
            // @ts-ignore
            averages[index][key] = previousValue
                ? Average_1.default(growths.slice(previousFour, index + 1).map(r => Number(r[key])))
                : 0;
            doublingTime[index][key] = isFinite(averages[index][key]) ? DoublingTime_1.default(averages[index][key]) : 0;
            // @ts-ignore
            perOneMillion[index][key] = PerMillionOfPopulation_1.default(lodash_1.get(record, totalKey), population);
            // @ts-ignore
            today[index][key] = index > 0
                ? Math.round(lodash_1.get(record, totalKey) - lodash_1.get(stats[previousOne], totalKey))
                : Number(lodash_1.get(record, totalKey));
            // @ts-ignore
            averagesTodays[index][key] = lodash_1.get(previousRecord, todayKey)
                ? Average_1.default(today.slice(previousFour, index + 1).map(r => Number(r[key])))
                : 0;
        });
    });
    return stats.map((record, index) => {
        var _a;
        metrics.forEach((key) => {
            if (lodash_1.get(record, `${key}.total`)) {
                if (enablePerOneMillion)
                    lodash_1.set(record, `${key}.perOneMillion`, perOneMillion[index][key]);
                if (enableToday)
                    lodash_1.set(record, `${key}.today`, today[index][key]);
                if (enableDoublingTime)
                    lodash_1.set(record, `${key}.doublingTime`, doublingTime[index][key]);
                if (enableGrowth)
                    lodash_1.set(record, `${key}.growth`, growths[index][key]);
                if (enable5dayAvg)
                    lodash_1.set(record, `${key}.avg5days`, averagesTodays[index][key]);
            }
        });
        if (((_a = record.events) === null || _a === void 0 ? void 0 : _a.length) === 0)
            delete record.events;
        return record;
    });
};
//# sourceMappingURL=index.js.map