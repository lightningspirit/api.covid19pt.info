const CountriesEn = require('./countries-en.json')

export const fromIso3 = (iso3: string): string | undefined => {
  const country = CountriesEn.find(({alpha3}: {alpha3: string}) => alpha3.toLowerCase() === iso3.toLowerCase())
  if (country) return country.iso2
}

export default (CountryName: string): string | undefined => {
  const country = CountriesEn.find(({name}: {name: string}) => name.toLowerCase() === CountryName.toLowerCase())
  if (country) return country.iso2
}
