"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_1 = __importDefault(require("./categories"));
const config = require('../../config.json');
describe('categories', () => {
    it('fetches and parses successfully', async () => {
        return categories_1.default(config.urls.categories)
            .then((records) => {
            expect(records.length).toBeGreaterThan(1);
        });
    });
});
//# sourceMappingURL=categories.test.js.map