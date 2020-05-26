"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CountriesEn = require('../../countries-en.json');
const CountriesPt = require('../../countries-pt.json');
exports.en = (CountryCode) => {
    const country = CountriesEn.find(({ iso2 }) => iso2 === CountryCode);
    if (country)
        return country.name;
};
exports.pt = (CountryCode) => {
    const country = CountriesPt.find(({ iso2 }) => iso2 === CountryCode);
    if (country)
        return country.name;
};
exports.default = {
    en: exports.en,
    pt: exports.pt
};
//# sourceMappingURL=countryName.js.map