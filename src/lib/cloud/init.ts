import { S3CloudProvider } from "../../pkg/cloud/s3.cloud";
import { env } from "../config/env";

// singeleton
export const s3CloudProvider = new S3CloudProvider({
   region: env.aws.region,
   accessKey: env.aws.accessKey,
   secretAccessKey: env.aws.secretKey,
   bucketName: env.aws.bucketName

   })


