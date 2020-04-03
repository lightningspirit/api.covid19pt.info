export enum AgeGroups {
  _0019 = "0-19",
  _2039 = "20-39",
  _4059 = "0-19",
  _6079 = "0-19",
  _80 = "80+"
}

export interface Total {
  total: number
  perOneMillion?: number
  today?: number
  doublingTime?: number
  growth?: number
}

export interface Source {
  name: string
  url?: string
}

export type Localized = {
  [s:string]: string
}

export interface Category {
  id: number
  name: Localized
}

export interface Event {
  date?: Date
  title: Localized
  category: {
    id: number
  }
  country?: {
    iso2: string
  }
  source: Source | null
}

export interface Stats {
  date?: Date
  type?: "region" | "age-group"
  label?: Localized
  cases: {
    confirmed: Total
    active?: Total
    nonConfirmed?: Total
    imported?: number
    exposure?: number
    suspects?: Total
    surveillance?: Total,
  }
  deaths?: Total
  recovered?: Total
  transmission?: {
    knownChains?: number
    fromCountries?: {
      [s:string]: number
    }
  },
  hospitalization?: {
    total?: number,
    critical?: number,
  },
  testing?: {
    total?: number,
    waiting?: number,
  },
  groups?: Stats[],
  events?: Event[]
  metadata?: {
    sources?: Source[]
  }
}

export interface Projection {
  date: Date
  nodes: {
    date: Date
    min: number
    max: number
  }[]
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Population {
  date: Date
  everyone: {
    females: number
    males: number
    total: number
  }
  groups: ({
    type: "age-group"
    label: AgeGroups
    females: number
    males: number
    total: number
  })[]
}

export interface World {
  stats: Stats
  population: Population
}

export interface Country {
  info: {
    iso2: string
    name: Localized
    continent?: Localized
    flag?: string
    coordinates?: Coordinates
  }
  stats?: Stats
  timeline?: Stats[]
  population?: Population
  projections?: Projection[]
}

export type Id<T> = {[K in keyof T]: T[K]}

export type HalLinks = {
  self: {
    title?: string
    href: string
  },
  [s:string]: {
    title?: string
    href: string
    templated?: boolean
  }
}

export type Hal<T, E> = T | {
    title?: string
    _embedded?: E
    _links?: HalLinks
  }
