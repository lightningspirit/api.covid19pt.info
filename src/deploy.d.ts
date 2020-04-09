declare module "s3-folder-upload" {
  export interface Credentials {
    accessKeyId?: string | undefined
    secretAccessKey?: string | undefined
    region?: string | undefined
    bucket?: string | undefined
  }
  export interface Options {
    useFoldersForFileTypes?: boolean
    useIAMRoleCredentials?: boolean
  }
  export interface Invalidation {
    awsDistributionId?: string | undefined
    awsInvalidationPath?: string | undefined
  }
  export default function (directoryName: string, credentials: Credentials, options?: Options, invalidation?: Invalidation): string
}

declare module "@akud/aws-s3-sync-by-hash" {
  export interface Options {
    accessKeyId?: string | undefined
    secretAccessKey?: string | undefined
    region?: string | undefined
    bucket: string
    root: string
    force?: boolean
    maxAge?: number
  }
  export default function (options: Options): Promise<{
    uploadedFiles: string[]
    deletedFiles: string[]
  }>
}
