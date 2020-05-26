"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const csv_parse_1 = __importDefault(require("csv-parse"));
const fetch_retry_1 = __importDefault(require("fetch-retry"));
// @ts-ignore
const fetch = fetch_retry_1.default(node_fetch_1.default);
exports.default = async ({ url, mime }, hydrate, values = {}) => {
    return fetch(url.replace(/{(\w+)}/g, (_, k) => {
        return values[k];
    }))
        .then(response => {
        switch (mime) {
            case "application/json": return response.json();
            case "text/csv": return response.text();
        }
    })
        .then((response) => {
        switch (mime) {
            case "application/json": return hydrate(response);
            case "text/csv": return new Promise((resolve, reject) => {
                csv_parse_1.default(response, {
                    columns: true,
                    trim: true,
                }, (error, records) => {
                    if (error)
                        reject(error);
                    else
                        resolve(hydrate(records));
                });
            });
        }
    });
};
//# sourceMappingURL=fetcher.js.map