"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (el) => {
    if (el.length === 0)
        return 0;
    if (el.find(l => isNaN(l)))
        throw Error('Impossible to average with a NaN');
    const result = el.reduce((c, l) => c + l) / el.length;
    if (isNaN(result))
        throw Error('Average result is NaN');
    return result;
};
//# sourceMappingURL=index.js.map