"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (n0, n1) => {
    if (n0 === 0 || isNaN(n0) || isNaN(n1))
        return 0;
    if (n0 === Infinity && n1 === Infinity)
        return 0;
    if (n0 === Infinity)
        return -Infinity;
    if (n1 === Infinity)
        return Infinity;
    return Number(((n1 - n0) / n0).toFixed(10));
};
//# sourceMappingURL=index.js.map