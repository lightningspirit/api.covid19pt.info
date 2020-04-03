import fetch from "node-fetch";
import parse from "csv-parse";
import { Feed } from "./types";

export default async <T, E>({
  url,
  mime
}: Feed, hydrate: (o: T) => E, values: {[s:string]: string} = {}): Promise<E> => {
  return fetch(url.replace(/{(\w+)}/g, (_,k) => {
    return values[k]
  }))
  .then(response => {
    switch (mime) {
      case "application/json": return response.json()
      case "text/csv": return response.text()
    }
  })
  .then((response) => {
    switch(mime) {
      case "application/json": return hydrate(response as T)
      case "text/csv": return new Promise<E>((resolve, reject) => {
        parse(response, {
            columns: true,
            trim: true,
          }, (error, records: T) => {
            if (error) reject(error);
            else resolve(
              hydrate(records)
            );
          }
        );
      })
    }
  })
}
