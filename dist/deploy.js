"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./deploy.d.ts" />
const aws_s3_sync_by_hash_1 = __importDefault(require("@akud/aws-s3-sync-by-hash"));
const glob_1 = __importDefault(require("glob"));
const fs_1 = require("fs");
const files = (pattern) => {
    return new Promise((resolve, reject) => {
        glob_1.default(pattern, (error, matches) => {
            if (error)
                reject(error);
            else
                resolve(matches);
        });
    });
};
(async () => {
    const matches = await files("build/**/*.json");
    for (const file of matches) {
        console.info('Minify', file);
        const json = JSON.parse(fs_1.readFileSync(file).toString());
        fs_1.writeFileSync(file, JSON.stringify(json));
    }
    console.log('Deploying');
    await aws_s3_sync_by_hash_1.default({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucket: `${process.env.AWS_BUCKET}/${process.env.API_VERSION}`,
        root: './build',
        maxAge: 300,
    });
})();
//# sourceMappingURL=deploy.js.map