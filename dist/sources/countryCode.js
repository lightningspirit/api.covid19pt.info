"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CountriesEn = require('../../countries-en.json');
exports.fromIso3 = (iso3) => {
    const country = CountriesEn.find(({ alpha3 }) => alpha3.toLowerCase() === iso3.toLowerCase());
    if (country)
        return country.iso2;
};
exports.default = (CountryName) => {
    const country = CountriesEn.find(({ name }) => name.toLowerCase() === CountryName.toLowerCase());
    if (country)
        return country.iso2;
};
//# sourceMappingURL=countryCode.js.map