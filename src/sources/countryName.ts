const CountriesEn = require('./countries-en.json')
const CountriesPt = require('./countries-pt.json')

export const en = (CountryCode: string) => {
  const country = CountriesEn.find(({iso2}: {iso2: string}) => iso2 === CountryCode)
  if (country) return country.name
}

export const pt = (CountryCode: string) => {
  const country = CountriesPt.find(({iso2}: {iso2: string}) => iso2 === CountryCode)
  if (country) return country.name
}

export default {
  en,
  pt
}
