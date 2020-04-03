import { groupBy } from "lodash"
import { ProjectionApiRecord, Feed } from "../types";
import { Projection } from "../api.types";
import fetcher from "../fetcher";

export default (feed: Feed) =>
  fetcher<ProjectionApiRecord[], Projection[]>(feed, records => {
    const ByProjection = groupBy(records, 'ProjectionDate')
    const ProjectionDates = Object.keys(ByProjection)

    return ProjectionDates.map((ThisProjectionDate) => ({
      date: new Date(ThisProjectionDate),
      nodes: ByProjection[ThisProjectionDate]
        .map(({
          Date: date, Max, Min
        }) => ({
          date: new Date(date),
          max: Number(Max),
          min: Number(Min)
      }))
    }))
  })
