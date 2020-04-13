import { Config } from "./types";
import { collection } from "./responses/Hal";
import { write, namespace } from "./data";
import { Category } from "./api.types";

const config: Config = require("../config.json");

const categories = require(`../data/categories.json`) as Category[]

(async () => {

  console.log('Retrieving Event Categories')

  await namespace(`build`)
  await namespace(`build/categories`)
  await write('build/categories/index', collection<Category[]>(
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
