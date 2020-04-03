export const ContinentNames = {
  'Africa': 'África',
  'Asia': 'Ásia',
  'Europe': 'Europa',
  'North America': 'America do Norte',
  'Oceania': 'Oceania',
  'South America': 'América do Sul',
}

export default (continent: keyof typeof ContinentNames) => ContinentNames[continent]
