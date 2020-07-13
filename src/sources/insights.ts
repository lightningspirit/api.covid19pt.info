import { InsightsApiResponse, Feed } from "../types";
import fetcher from "../fetcher";
import { Stats, Localized } from "../api.types";
import isNumeric from "../math/isNumeric";

export interface Historical {
  info: {
    code: string;
    name: Localized;
  };
  timeline: Stats[];
}

export default (feed: Feed) =>
  fetcher<InsightsApiResponse[], Stats[]>(feed, records => {

    const stats = records.map(({
      data,
      cadeias_transmissao,
      confirmados,
      confirmados_0_9_f,
      confirmados_0_9_m,
      confirmados_10_19_f,
      confirmados_10_19_m,
      confirmados_20_29_f,
      confirmados_20_29_m,
      confirmados_30_39_f,
      confirmados_30_39_m,
      confirmados_40_49_f,
      confirmados_40_49_m,
      confirmados_50_59_f,
      confirmados_50_59_m,
      confirmados_60_69_f,
      confirmados_60_69_m,
      confirmados_70_79_f,
      confirmados_70_79_m,
      confirmados_80_plus_f,
      confirmados_80_plus_m,
      confirmados_acores,
      confirmados_arsalentejo,
      confirmados_arsalgarve,
      confirmados_arscentro,
      confirmados_arslvt,
      confirmados_arsnorte,
      confirmados_estrangeiro,
      confirmados_madeira,
      confirmados_novos,
      n_confirmados,
      internados,
      internados_uci,
      transmissao_importada,
      lab,
      obitos_0_9_m,
      obitos,
      obitos_0_9_f,
      obitos_10_19_f,
      obitos_10_19_m,
      obitos_20_29_f,
      obitos_20_29_m,
      obitos_30_39_f,
      obitos_30_39_m,
      obitos_40_49_f,
      obitos_40_49_m,
      obitos_50_59_f,
      obitos_50_59_m,
      obitos_60_69_f,
      obitos_60_69_m,
      obitos_70_79_f,
      obitos_70_79_m,
      obitos_80_plus_f,
      obitos_80_plus_m,
      obitos_acores,
      obitos_arsalentejo,
      obitos_arsalgarve,
      obitos_arscentro,
      obitos_arslvt,
      obitos_arsnorte,
      obitos_estrangeiro,
      obitos_madeira,
      recuperados,
      suspeitos,
      vigilancia,
    }) => {

      const result: Stats = {
        cases: {
          confirmed: {
            total: Number(confirmados),
          }
        }
      }

      if (data !== undefined)
        result.date = new Date(data.split('-').reverse().join('-'))

      if (cadeias_transmissao !== undefined)
        result.transmission = { knownChains: Number(cadeias_transmissao) }

      if (n_confirmados !== undefined)
        result.cases.nonConfirmed = {
          total: Number(n_confirmados),
        }

      if (suspeitos !== undefined)
        result.cases.suspects = {
          total: Number(suspeitos),
        }

      if (obitos !== undefined && recuperados !== undefined)
        result.cases.active = {
          total: Number(confirmados) - Number(recuperados) - Number(obitos)
        }

      if (transmissao_importada !== undefined)
        result.cases.imported = {
          total: Number(transmissao_importada)
        }

      if (transmissao_importada !== undefined)
        result.cases.exposure = {
          total: Number(confirmados) - Number(transmissao_importada)
        }

      if (vigilancia !== undefined)
        result.cases.surveillance = {
          total: Number(vigilancia)
        }

      if (obitos !== undefined)
        result.deaths = {
          total: isNumeric(obitos) ? Number(obitos) : null,
        }

      if (recuperados !== undefined) {
        result.recovered = {
          total: isNumeric(recuperados) ? Number(recuperados) : null,
        }
      }

      if (internados !== undefined) {
        result.hospitalization = {
          total: isNumeric(internados) ? Number(internados) : null,
        }

        if (internados_uci !== undefined) {
          result.critical = {
            total: isNumeric(internados_uci) ? Number(internados_uci) : null,
          }
        }
      }

      if (lab !== undefined) {
        result.testing = {
          total: 0,//Number(Testing)
        }

        if (lab !== undefined) {
          result.testing.waiting = Number(lab)
        }
      }

      result.groups = []

      new Array(
        {
          group: "0-19",
          type: "age-group",
          confirmed: Number(confirmados_0_9_f) + Number(confirmados_0_9_m) + Number(confirmados_10_19_f) + Number(confirmados_10_19_m),
          deaths: Number(obitos_0_9_f) + Number(obitos_0_9_m) + Number(obitos_10_19_f) + Number(obitos_10_19_m)
        },
        {
          group: "20-39",
          type: "age-group",
          confirmed: Number(confirmados_20_29_f) + Number(confirmados_20_29_m) + Number(confirmados_30_39_f) + Number(confirmados_30_39_m),
          deaths: Number(obitos_20_29_f) + Number(obitos_20_29_m) + Number(obitos_30_39_f) + Number(obitos_30_39_m)
        },
        {
          group: "40-59",
          type: "age-group",
          confirmed: Number(confirmados_40_49_f) + Number(confirmados_40_49_m) + Number(confirmados_50_59_f) + Number(confirmados_50_59_m),
          deaths: Number(obitos_40_49_f) + Number(obitos_40_49_m) + Number(obitos_50_59_f) + Number(obitos_50_59_m)
        },
        {
          group: "60-79",
          type: "age-group",
          confirmed: Number(confirmados_60_69_f) + Number(confirmados_60_69_m) + Number(confirmados_70_79_f) + Number(confirmados_70_79_m),
          deaths: Number(obitos_60_69_f) + Number(obitos_60_69_m) + Number(obitos_70_79_f) + Number(obitos_70_79_m)
        },
        {
          group: "80+",
          type: "age-group",
          confirmed: Number(confirmados_80_plus_f) + Number(confirmados_80_plus_m),
          deaths: Number(obitos_80_plus_f) + Number(obitos_80_plus_m)
        },


        {
          group: ["Norte", "North"],
          type: "region",
          confirmed: Number(confirmados_arsnorte),
          deaths: Number(obitos_arsnorte)
        },
        {
          group: ["Centro", "Center"],
          type: "region",
          confirmed: Number(confirmados_arscentro),
          deaths: Number(obitos_arscentro)
        },
        {
          group: ["Lisboa", "Lisbon"],
          type: "region",
          confirmed: Number(confirmados_arslvt),
          deaths: Number(obitos_arslvt)
        },
        {
          group: "Alentejo",
          type: "region",
          confirmed: Number(confirmados_arsalentejo),
          deaths: Number(obitos_arsalentejo)
        },
        {
          group: "Algarve",
          type: "region",
          confirmed: Number(confirmados_arsalgarve),
          deaths: Number(obitos_arsalgarve)
        },
        {
          group: "Madeira",
          type: "region",
          confirmed: Number(confirmados_madeira),
          deaths: Number(obitos_madeira)
        },
        {
          group: ["Açores", "Azores"],
          type: "region",
          confirmed: Number(confirmados_acores),
          deaths: Number(obitos_acores)
        },
      ).forEach(({
        group, type, confirmed, deaths
      }) => {
        result.groups?.push({
          // @ts-ignore
          type,
          label: {
            pt: Array.isArray(group) ? group[0] : group,
            en: Array.isArray(group) ? group[1] : group,
          },
          cases: {
            confirmed: {
              total: confirmed
            },
            active: {
              total: confirmed - deaths
            }
          },
          deaths: {
            total: deaths
          },
          recovered: {
            total: null
          },
        })
      })

      /*if (Reference)
        result.metadata = {
          sources: [
            {
              name: new URL(Reference).hostname.replace('www.', ''),
              url: Reference
            }
          ]
        }*/

      return result
    })

    return stats
  })
