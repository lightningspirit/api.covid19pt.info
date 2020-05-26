"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
describe('ZeroOrPositive', () => {
    const samples = [
        [0, 0],
        [-1, 0],
        [1, 1],
    ];
    it.each(samples)('ZeroOrPositive(%d) = %d', (n, r) => {
        expect(_1.default(n)).toBe(r);
    });
});
//# sourceMappingURL=index.test.js.map