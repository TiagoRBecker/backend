import aws,{ S3Client } from "@aws-sdk/client-s3";


class Aws {
     private client: S3Client
     constructor() {
     this.client = new aws.S3({
        region:process.env.AWS_DEFAUT_REGION
     })
    }
}