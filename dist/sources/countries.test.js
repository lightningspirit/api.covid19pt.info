"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const countries_1 = __importDefault(require("./countries"));
const config = require('../../config.json');
describe('countries', () => {
    it('fetches and parses successfully', async () => {
        return countries_1.default({
            url: config.urls.countries
        })
            .then((records) => {
            expect(records.length).toBeGreaterThan(120);
        });
    });
});
//# sourceMappingURL=countries.test.js.map