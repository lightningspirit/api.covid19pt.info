/// <reference path="./deploy.d.ts" />
import awsS3Sync from "@akud/aws-s3-sync-by-hash"

awsS3Sync({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucket: `${process.env.AWS_BUCKET}/${process.env.API_VERSION}`,
  root: './build',
  maxAge: 300,
});
