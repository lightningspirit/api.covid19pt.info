"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("./events"));
const config = require('../../config.json');
describe('events', () => {
    it('fetches and parses successfully', async () => {
        return events_1.default(config.urls.events)
            .then((records) => {
            expect(records.length).toBeGreaterThan(1);
        });
    });
    it('first record has date', async () => {
        return events_1.default(config.urls.events)
            .then((records) => {
            expect(records[0].date).toBeInstanceOf(Date);
        });
    });
});
//# sourceMappingURL=events.test.js.map