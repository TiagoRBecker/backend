import { S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import multer from "multer";
import path from "path";
import multerS3 from "multer-s3"

    const aws = new S3Client({
      region: "sa-east-1",
      credentials: {
        accessKeyId: "AKIA4G22ZUT54R6NYXN3",
        secretAccessKey: "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",
      },
    } as any);

 export   const multerConfig = multer({
      storage: multerS3({
        s3: aws,
        bucket: "plashmagazine",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (req: any, file: any, cb: any) => {
          const fileName =
            path.parse(file.originalname).name.replace(/\s/g, "") +
            "-" +
            randomUUID();

          const extension = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`);
        },
      } as any),
    });