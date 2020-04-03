import { CategoriesApiResponse, Feed } from "../types";
import fetcher from "../fetcher";
import { Category } from "../api.types";

export default (feed: Feed) =>
  fetcher<CategoriesApiResponse[], Category[]>(feed, records => {
    return records.map(({
      Id, TitlePt, TitleEn
    }) => ({
      id: Number(Id),
      name: {
        en: TitleEn,
        pt: TitlePt,
      }
    }))
  })
