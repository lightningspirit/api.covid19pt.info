import { Config } from "./types";
import { collection } from "./responses/Hal";
import { write, namespace } from "./data";
import { Event } from "./api.types";

const config: Config = require("../config.json");

const events = (require(`../data/events.json`) as Event[])
  .map(({date, ...all}) => ({
    date: date ? new Date(date) : undefined,
    ...all
  }));

(async () => {

  console.log('Retrieving Event Categories')

  await namespace(`build/events`)

  await write('build/events/index', collection<Event[]>(
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

})()
