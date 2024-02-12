"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTempHashCookie = void 0;
const crypto_1 = require("crypto");
const setTempHashCookie = (req, res, next) => {
    const hash = (0, crypto_1.randomUUID)();
    // Configurar o cookie no navegador do usuário
    res.cookie('tempHash', hash, { maxAge: 2 * 60 * 60 * 1000 }); // Tempo de vida de 2 horas em milissegundos
    // Continue para a próxima rota
    next();
};
exports.setTempHashCookie = setTempHashCookie;
