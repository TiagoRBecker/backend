"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../server/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class Auth {
    //Funçao para tratar dos erros no servidor
    handleError(error, res) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
    //Função para desconetar o orm prisma
    handleDisconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.$disconnect());
        });
    }
    createAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, lastName, district, password, email, cep, adress, city, complement, numberAdress, avatar } = req.body;
            const chekingEmail = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.user.findUnique({
                where: {
                    email: email
                }
            }));
            if (chekingEmail) {
                throw new Error("E-mail já cadastrado no banco de dados!");
            }
            try {
                const create = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.user.create({
                    data: {
                        name,
                        lastName,
                        password,
                        email,
                        cep,
                        adress,
                        city,
                        complement,
                        numberAdress,
                        district,
                        avatar
                    },
                }));
                return res.status(200).json({ message: "Conta criada com sucesso!" });
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    createAccountUserMaster(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, lastName, password, email, avatar } = req.body;
            const hash = yield bcrypt_1.default.hash(password, Number(process.env.SALT));
            const chekingEmail = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.user.findUnique({
                where: {
                    email: email
                }
            }));
            if (chekingEmail) {
                throw new Error("E-mail já cadastrado no banco de dados!");
            }
            try {
                const create = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.userMaster.create({
                    data: {
                        name,
                        email,
                        avatar,
                        password: hash
                    },
                }));
                return res.status(200).json({ message: "Conta criada com sucesso!" });
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    authentication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { credentials } = req.body;
            const chekingEmail = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.user.findUnique({
                where: {
                    email: credentials.email
                }
            }));
            if (!chekingEmail) {
                return res.status(404).json({ message: "E-mail não cadastrado no sistema!" });
            }
            const user = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.user.findUnique({
                where: {
                    email: credentials.email,
                    password: credentials.password
                }
            }));
            if (!user) {
                return res.status(401).json({ message: "E-mail ou senha invalidos" });
            }
            if (user) {
                const token = jsonwebtoken_1.default.sign({
                    id: user === null || user === void 0 ? void 0 : user.id,
                    name: user === null || user === void 0 ? void 0 : user.name,
                    email: user === null || user === void 0 ? void 0 : user.email,
                }, process.env.SECRET, { expiresIn: "1d" });
                return res.status(200).json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    city: user.city,
                    adress: user.adress,
                    cep: user.cep,
                    numberAdress: user.numberAdress,
                    complement: user.complement,
                    district: user.district,
                    accessToken: token,
                });
            }
            else {
                return res.status(404).json({ message: "E-mail ou senha invalidos" });
            }
        });
    }
    authenticationUserMaster(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { credentials } = req.body;
            console.log(req.body);
            const userMaster = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.userMaster.findUnique({
                where: {
                    email: credentials === null || credentials === void 0 ? void 0 : credentials.email
                }
            }));
            if (!userMaster) {
                return res.status(404).json({ message: "E-mail não cadastrado no sistema!" });
            }
            const macth = yield bcrypt_1.default.compare(credentials === null || credentials === void 0 ? void 0 : credentials.password, userMaster.password);
            if (macth) {
                const token = jsonwebtoken_1.default.sign({
                    id: userMaster === null || userMaster === void 0 ? void 0 : userMaster.id,
                    name: userMaster === null || userMaster === void 0 ? void 0 : userMaster.name,
                    email: userMaster === null || userMaster === void 0 ? void 0 : userMaster.email,
                }, process.env.SECRET, { expiresIn: "1d" });
                return res.status(200).json({
                    id: userMaster.id,
                    name: userMaster.name,
                    email: userMaster.email,
                    accessToken: token,
                });
            }
            else {
                return res.status(401).json({ message: "E-mail ou senha inválidos" });
            }
        });
    }
}
const AuthControllers = new Auth();
exports.default = AuthControllers;
