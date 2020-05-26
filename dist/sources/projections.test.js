"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const projections_1 = __importDefault(require("./projections"));
const config = require('../../config.json');
describe('projections', () => {
    it('fetches and parses successfully', async () => {
        return projections_1.default(config.urls.projections.pt)
            .then((records) => {
            expect(records.length).toBeGreaterThan(1);
        });
    });
    it('record has right types', async () => {
        return projections_1.default(config.urls.projections.pt)
            .then((records) => {
            expect(records[0].date).toBeInstanceOf(Date);
            expect(records[0].nodes[0].date).toBeInstanceOf(Date);
            expect(records[0].nodes[0].min).toBeGreaterThan(1);
            expect(records[0].nodes[0].max).toBeGreaterThan(1);
            expect(records[0].nodes[0].max > records[0].nodes[0].min).toBe(true);
        });
    });
});
//# sourceMappingURL=projections.test.js.map