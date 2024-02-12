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
exports.chekingToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chekingToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.SECRET;
    let token;
    // Verifica se há um token no cabeçalho Authorization
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const [authtype, authToken] = authorizationHeader.split(" ");
        if (authtype === 'Bearer') {
            token = authToken;
        }
    }
    // Se não houver token no cabeçalho, verifica se há um token na query
    if (!token) {
        const queryToken = req.query.token;
        if (queryToken) {
            token = queryToken;
        }
    }
    if (!token) {
        return res.status(401).json({ msg: "Não autorizado" });
    }
    try {
        const decoded = yield jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded; // Adiciona as informações do usuário ao objeto de requisição
        res.cookie('token', token, { path: '/' });
        next();
    }
    catch (err) {
        console.error('Erro na verificação do token:', err);
        res.status(401).json({ msg: 'Não autorizado' });
    }
});
exports.chekingToken = chekingToken;
