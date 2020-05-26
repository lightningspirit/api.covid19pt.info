"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
describe('DoublingTime', () => {
    const samples = [
        [0.001, 693.4936964168994],
        [0.002, 346.9200484611006],
        [0.021, 33.352381750477555],
        [0.041, 17.25028145569674],
        [0.11, 6.641884618417903],
        [0.20, 3.8017840169239308],
        [-0.1, -6.578813478960585],
        [Infinity, 0],
    ];
    it.each(samples)('DoublingTime(%d) = %s', (r, Td) => {
        expect(_1.default(r)).toBe(Td);
    });
});
//# sourceMappingURL=index.test.js.map