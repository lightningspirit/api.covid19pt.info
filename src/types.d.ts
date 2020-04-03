export interface Feed {
  url: string
  mime: "application/json" | "text/csv"
}

export interface Config {
  apiUrl: string
  urls: {
    events: Feed
    categories: Feed
    insights: {
      [s:string]: {
        country: Feed
        groups?: {
          type: "age-group" | "region"
          label: {
            [s:string]: string
          }
          feed: Feed
        }[]
      }
    }
    projections: {
      [s:string]: Feed
    }
    world: string
    countries: string
    historical: Feed
    population: string
  }
}

export interface EventsApiRecord {
  Date: string
  EventEn: string
  EventPt: string
  Type: string
  Country: string
  Source: string
}

export interface CategoriesApiResponse {
  Id: string
  TitleEn: string
  TitlePt: string
}

export interface ProjectionApiRecord {
  ProjectionDate: string
  Date: string
  Max: string
  Min: string
}

export interface InsightsApiResponse {
  Date: string
  Confirmed: string
  Exposure: string
  Imported: string
  Suspects: string
  Surveillance: string
  Recovered: string
  Deaths: string
  Hospitalized: string
  Critical: string
  NonConfirmed: string
  Testing: string
  Waiting: string
  Chains: string
  Reference: string
}

export interface NovelCovidWorldApiResponse {
  cases: number
  deaths: number
  active: number
  recovered: number
  updated: number
}

export interface NovelCovidHistoricalApiResponse {
  country: string,
  province: string | null
  timeline: {
    cases: {
      [s:string]: number
    },
    deaths: {
      [s:string]: number
    },
    recovered: {
      [s:string]: number
    }
  }
}

export interface NovelCovidJhucsseApiResponse {
  country: string
  province: string
  updatedAt: string
  stats: {
    confirmed: number
    deaths: number
    recovered: number
  },
  coordinates: {
    latitude: string,
    longitude: string
  }
}

export interface NovelCovidHistoricalApiResponse {
  country: string,
  province: string | null
  timeline: {
    cases: {
      [s:string]: number
    },
    deaths: {
      [s:string]: number
    },
    recovered: {
      [s:string]: number
    }
  }
}

export interface NovelCovidCountriesApiResponse {
  country: string
  countryInfo: {
    _id: number
    country: string
    iso2: string
    iso3: string
    lat: number
    long: number
    flag: string
  },
  cases: number
  todayCases: number
  deaths: number
  todayDeaths: number
  recovered: number
  active: number
  critical: number
  casesPerOneMillion: number
  deathsPerOneMillion: number
  updated: number
}

export interface PopulationApiResponse {
  females: number,
  country: string,
  age: number,
  males: number,
  year: number,
  total: number
}
