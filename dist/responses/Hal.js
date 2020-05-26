"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collection = (title, links, model) => {
    let result = {
        title,
        _links: links,
        _embedded: model,
    };
    return result;
};
exports.resource = (title, links, model, embedded) => {
    let result = {};
    if (title)
        result = { ...result, title };
    if (links)
        result = { ...result, _links: links };
    if (model)
        result = { ...result, ...model };
    if (embedded)
        result = { ...result, ...{ _embedded: embedded } };
    return result;
};
//# sourceMappingURL=Hal.js.map