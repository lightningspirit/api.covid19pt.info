"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
exports.namespace = (key) => {
    return new Promise(resolve => fs.mkdir(`./${key}`, resolve));
};
exports.write = async (key, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(`./${key}.json`, JSON.stringify(data, null, 2), (error) => {
            if (error)
                reject(error);
            else
                resolve();
        });
    });
};
//# sourceMappingURL=data.js.map