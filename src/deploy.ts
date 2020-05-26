/// <reference path="./deploy.d.ts" />
import awsS3Sync from "@akud/aws-s3-sync-by-hash"
import glob from "glob"
import { readFileSync, writeFileSync } from "fs"

const files = (pattern: string) => {
  return new Promise<string[]>((resolve, reject) => {
    glob(pattern, (error, matches) => {
      if (error) reject(error)
      else resolve(matches)
    })
  })
}

(async () => {
  const matches = await files("build/**/*.json")

  for (const file of matches) {
    console.info('Minify', file)

    const json = JSON.parse(readFileSync(file).toString())
    writeFileSync(file, JSON.stringify(json))
  }

  console.log('Deploying')

  await awsS3Sync({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: `${process.env.AWS_BUCKET}/${process.env.API_VERSION}`,
    root: './build',
    maxAge: 300,
  })
})()
