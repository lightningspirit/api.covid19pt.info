"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timeline_1 = __importDefault(require("./timeline"));
const config = require('../../config.json');
describe('historical', () => {
    it('fetches and parses successfully', async () => {
        return timeline_1.default(config.urls.historical, 'pt')
            .then((timeline) => {
            expect(timeline.length).toBeGreaterThan(10);
            expect(timeline[0]).toMatchObject({
                date: new Date("2020-01-22T00:00:00.000Z"),
                cases: { confirmed: { total: 0 } },
                deaths: { total: 0 },
                recovered: { total: 0 },
            });
        });
    });
});
//# sourceMappingURL=timeline.test.js.map