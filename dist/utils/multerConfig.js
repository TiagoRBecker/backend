"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = require("crypto");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws = new client_s3_1.S3Client({
    region: "sa-east-1",
    credentials: {
        accessKeyId: "AKIA4G22ZUT54R6NYXN3",
        secretAccessKey: "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",
    },
});
exports.multerConfig = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws,
        bucket: "plashmagazine",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (req, file, cb) => {
            const fileName = path_1.default.parse(file.originalname).name.replace(/\s/g, "") +
                "-" +
                (0, crypto_1.randomUUID)();
            const extension = path_1.default.parse(file.originalname).ext;
            cb(null, `${fileName}${extension}`);
        },
    }),
});
