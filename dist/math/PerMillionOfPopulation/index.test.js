"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
describe('PerMillionPopulation', () => {
    const samples = [
        [4, 10000000, 0],
        [800, 10000000, 80],
    ];
    it.each(samples)('PerMillionPopulation(%d, %d) = %d', (n, population, result) => {
        expect(_1.default(n, population)).toBe(result);
    });
});
//# sourceMappingURL=index.test.js.map