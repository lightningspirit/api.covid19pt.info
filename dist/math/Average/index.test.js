"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
describe('Average', () => {
    const samples = [
        [[0, 1], 0.5],
        [[1, 2], 1.5],
        [[2, 4, 6], 4],
        [[2, Infinity], Infinity],
        [[2, -1], 0.5],
        [[-2, 1], -0.5],
    ];
    it.each(samples)('Average(%p) = %d', (el, avg) => {
        expect(_1.default(el)).toBe(avg);
    });
    it('throws error when a NaN is present', () => {
        expect(
        // @ts-ignore
        () => _1.default([1, 'a'])).toThrowError('Impossible to average with a NaN');
    });
});
//# sourceMappingURL=index.test.js.map