import { NovelCovidHistoricalApiResponse, Feed } from "../types";
import { Stats } from "../api.types";
import fetcher from "../fetcher";

export default (feed: Feed, iso2: string) => {
  return fetcher<NovelCovidHistoricalApiResponse, Stats[] | []>(feed, ({
    timeline
  }) => {
    return timeline
    ? Object.keys(timeline.cases).map(date => {
        return ({
          date: new Date(date),
          cases: {
            confirmed: {
              total: timeline.cases[date]
            }
          },
          deaths: {
            total: timeline.deaths[date]
          },
          recovered: {
            total: timeline.recovered[date]
          },
        })
      })
    : []
  }, {
    iso2
  })
}
