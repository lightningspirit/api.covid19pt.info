import { EventsApiRecord, Feed } from "../types";
import fetcher from "../fetcher";
import { Event } from "../api.types";

export default (feed: Feed) =>
  fetcher<EventsApiRecord[], Event[]>(feed, records => {
    return records.map(({
      Date: date, EventEn, EventPt, Type, Country, Source
    }) => ({
      date: new Date(date),
      title: {
        pt: EventPt,
        en: EventEn,
      },
      category: {
        id: Number(Type)
      },
      country: {
        iso2: Country.toLowerCase()
      },
      source: Source ? {
        name: new URL(Source).hostname.replace('www.', ''),
        url: Source,
      } : null
    }))
  })

