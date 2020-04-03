import { Hal, HalLinks } from "../api.types"

export const collection = <T>(title?: string, links?: HalLinks, model?: T): Hal<T, T> => {
  let result = {
    title,
    _links: links,
    _embedded: model,
  }

  return result
}

export const resource = <T, E>(title?: string, links?: HalLinks, model?: T, embedded?: E): Hal<T, E> => {
  let result = {}

  if (title) result = { ...result, title }
  if (links) result = { ...result, _links: links }
  if (model) result = {...result, ...model}
  if (embedded) result = {...result, ...{ _embedded: embedded } }

  return result
}
