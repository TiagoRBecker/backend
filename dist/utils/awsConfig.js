"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = __importDefault(require("@aws-sdk/client-s3"));
class Aws {
    constructor() {
        this.client = new client_s3_1.default.S3({
            region: process.env.AWS_DEFAUT_REGION
        });
    }
}
