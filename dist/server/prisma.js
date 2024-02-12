"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaClient = global.prisma || new client_1.PrismaClient();
//check if we are running in production mode
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prismaClient;
}
exports.default = prisma;
