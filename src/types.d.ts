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
        testing: Feed
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
  data: string
  confirmados: string
  confirmados_arsnorte	: string
  confirmados_arscentro: string
  confirmados_arslvt: string
  confirmados_arsalentejo: string
  confirmados_arsalgarve: string
  confirmados_acores: string
  confirmados_madeira: string
  confirmados_estrangeiro: string
  confirmados_novos: string
  recuperados: string
  obitos: string
  internados: string
  internados_uci: string
  lab: string
  suspeitos: string
  vigilancia: string
  n_confirmados: string
  cadeias_transmissao: string
  transmissao_importada: string
  confirmados_0_9_f: string
  confirmados_0_9_m: string
  confirmados_10_19_f: string
  confirmados_10_19_m: string
  confirmados_20_29_f: string
  confirmados_20_29_m: string
  confirmados_30_39_f: string
  confirmados_30_39_m: string
  confirmados_40_49_f: string
  confirmados_40_49_m: string
  confirmados_50_59_f: string
  confirmados_50_59_m: string
  confirmados_60_69_f: string
  confirmados_60_69_m: string
  confirmados_70_79_f: string
  confirmados_70_79_m: string
  confirmados_80_plus_f: string
  confirmados_80_plus_m: string
  obitos_arsnorte: string
  obitos_arscentro: string
  obitos_arslvt: string
  obitos_arsalentejo: string
  obitos_arsalgarve: string
  obitos_acores: string
  obitos_madeira: string
  obitos_estrangeiro: string
  obitos_0_9_f: string
  obitos_0_9_m: string
  obitos_10_19_f: string
  obitos_10_19_m: string
  obitos_20_29_f: string
  obitos_20_29_m: string
  obitos_30_39_f: string
  obitos_30_39_m: string
  obitos_40_49_f: string
  obitos_40_49_m: string
  obitos_50_59_f: string
  obitos_50_59_m: string
  obitos_60_69_f: string
  obitos_60_69_m: string
  obitos_70_79_f: string
  obitos_70_79_m: string
  obitos_80_plus_f: string
  obitos_80_plus_m: string

}

export interface NovelCovidWorldApiResponse {
  cases: number
  todayCases: number
  casesPerOneMillion: number
  deaths: number
  todayDeaths: number
  deathsPerOneMillion: number
  critical: number
  active: number
  recovered: number
  tests: number
  testsPerOneMillion: number
  affectedCountries: number
  updated: number
}

export interface NovelCovidTimelineApiResponse {
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

export interface NovelCovidHistoricalApiResponse {
  country: string,
  province: string | null
  timeline: NovelCovidTimelineApiResponse
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
  tests: number
  casesPerOneMillion: number
  deathsPerOneMillion: number
  testsPerOneMillion: number
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
