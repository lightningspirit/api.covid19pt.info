"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
describe('Growth', () => {
    const samples = [
        [0, 1, 0],
        [1, 2, 1],
        [2, 3, 0.5],
        [100, 160, 0.6],
        [10000, 10060, 0.006],
        [10000, 9000, -0.1],
        [Infinity, 1, -Infinity],
        [1, Infinity, Infinity],
    ];
    it.each(samples)('Growth(%d, %d) = %s', (n0, n1, result) => {
        expect(_1.default(n0, n1)).toBe(result);
    });
});
//# sourceMappingURL=index.test.js.map