import * as fs from "fs"

export const namespace = (key: string) => {
  return new Promise(resolve => fs.mkdir(`./${key}`, resolve))
}

export const write = async (key: string, data: any) => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(`./${key}.json`, JSON.stringify(data, null, 2), (error) => {
      if (error) reject(error)
      else resolve()
    })
  })
}
