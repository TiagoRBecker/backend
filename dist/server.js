"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path = require('path');
const cookieParser = require('cookie-parser');
const index_1 = __importDefault(require("./routes/index"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(cookieParser());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.set('views', path.join(__dirname, 'views'));
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(index_1.default);
app.listen(5000, () => {
    console.log("Servidor rodando na porta http://localhost:5000");
});
