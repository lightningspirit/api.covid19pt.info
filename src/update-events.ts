import { Config } from "./types";
import Events from "./sources/events"
import Categories from "./sources/categories"
import { write } from "./data";
import { collection } from "./responses/Hal";
import { Event, Category } from "./api.types";

const config: Config = require("./config.json");

(async () => {
  console.log('Retrieving Events')

  const events = await Events(config.urls.events)

  await write('events', collection<Event[]>(
    "Events Timeline for all countries",
    {
      self: {
        title: "Events Timeline",
        href: `${config.apiUrl}/events/`
      },
      parent: {
        href: `${config.apiUrl}/`,
      }
    },
    events,
  ))

  console.log('Saved Events')

  console.log('Retrieving Event Categories')

  const categories = await Categories(config.urls.categories)

  await write('categories', collection<Category[]>(
    "Event Categories",
    {
      self: {
        title: "Event Categories",
        href: `${config.apiUrl}/categories/`
      },
      events: {
        title: "Events Timeline",
        href: `${config.apiUrl}/events/`
      }
    },
    categories,
  ))

  console.log('Saved Event Categories')

})()
