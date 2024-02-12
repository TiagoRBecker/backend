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
const express_1 = require("express");
const Categories_1 = __importDefault(require("../Controllers/Categories"));
const Article_1 = __importDefault(require("../Controllers/Article"));
const index_1 = __importDefault(require("../Controllers/Magazine/index"));
const multerConfig_1 = require("../utils/multerConfig");
const DVL_1 = __importDefault(require("../Controllers/DVL"));
const MercadoPago_1 = __importDefault(require("../Controllers/MercadoPago"));
const MercadoPago_2 = require("../Controllers/MercadoPago");
const Auth_1 = __importDefault(require("../Controllers/Auth"));
const User_1 = __importDefault(require("../Controllers/User"));
const correios_brasil_1 = require("correios-brasil");
const route = (0, express_1.Router)();
//Categories
route.get("/categories", Categories_1.default.getAllCategories);
route.get("/category/:slug", Categories_1.default.getOneCategory);
route.post("/category/:slug", Categories_1.default.updateCategory);
route.post("/create-category", Categories_1.default.createCategory);
route.delete("/delet-category", Categories_1.default.deleteCategory);
//Article
route.get("/articles", Article_1.default.getAllArticle);
route.get("/articles-free", Article_1.default.getArticleFree);
route.get("/articles-most-read", Article_1.default.getArticleMostRead);
route.get("/articles-trend", Article_1.default.getArticleTrend);
route.get("/articles-recommended", Article_1.default.getArticleRecommended);
route.post("/create-article", multerConfig_1.multerConfig.fields([{ name: "cover_file", maxCount: 1 }, { name: "pdf_file", maxCount: 1 },]), Article_1.default.createArticle);
route.post("/update-article/:slug", multerConfig_1.multerConfig.fields([{ name: "cover_file", maxCount: 1 }, { name: "pdf_file", maxCount: 1 },]), Article_1.default.updateArticle);
route.get("/article/:slug", Article_1.default.getOneArticle);
route.delete("/delet-article", Article_1.default.deleteArticle);
//Magazine
route.get("/magazines", index_1.default.getAllMagazine);
route.get("/magazine/:slug", index_1.default.getOneMagazine);
route.post("/create-magazine", multerConfig_1.multerConfig.fields([
    { name: "cover_file", maxCount: 1 },
    { name: "pdf_file", maxCount: 1 },
]), index_1.default.createMagazine);
route.post("/update-magazine/:slug", multerConfig_1.multerConfig.fields([
    { name: "cover_file", maxCount: 1 },
    { name: "pdf_file", maxCount: 1 },
]), index_1.default.updateMagazine);
route.delete("/delet-magazine", index_1.default.deleteMagazine);
//Auth
route.post("/signUp", Auth_1.default.createAccount);
route.post("/signIn", Auth_1.default.authentication);
//Users
route.get("/user/:slug", User_1.default.getOneUser);
route.post("/user-perfil", multerConfig_1.multerConfig.single("perfil"), User_1.default.updateUser);
route.post("/user-pass", User_1.default.changePassUser);
//Uploads
//Cep
route.post("/cep", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let args = {
            // Não se preocupe com a formatação dos valores de entrada do cep, qualquer uma será válida (ex: 21770-200, 21770 200, 21asa!770@###200 e etc),
            sCepOrigem: '81200100',
            sCepDestino: '21770200',
            nVlPeso: '1',
            nCdFormato: '1',
            nVlComprimento: '20',
            nVlAltura: '20',
            nVlLargura: '20',
            nCdServico: ['04014', '04510'], //Array com os códigos de serviço
            nVlDiametro: '0',
        };
        const getCep = (0, correios_brasil_1.calcularPrecoPrazo)(args).then((response) => {
            console.log(response);
        }).catch((error) => console.log(error));
        return res.status(200).json(getCep);
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = route;
route.post("/read", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nameBook } = req.body;
    if (nameBook) {
        const getBook = yield (prisma === null || prisma === void 0 ? void 0 : prisma.magazine.findMany({
            where: {
                name: nameBook,
            },
            select: {
                magazine_pdf: true,
            },
        }));
        return res.status(200).json(getBook);
    }
}));
route.post("/users/:slug", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const { dvl, pay } = req.body;
    const someValues = dvl.map((items) => Number(items.paidOut) - Number(pay));
    try {
        const dvls = yield (prisma === null || prisma === void 0 ? void 0 : prisma.dvl.updateMany({
            where: {
                name: slug
            },
            data: {
                toReceive: {
                    increment: Number(pay)
                },
                paidOut: {
                    decrement: Number(pay)
                }
            }
        }));
        console.log(dvls);
        return res.status(200).json(dvls);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro" });
    }
}));
route.get("/users/:slug", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    console.log(slug);
    try {
        const user = yield (prisma === null || prisma === void 0 ? void 0 : prisma.user.findUnique({
            where: {
                id: Number(slug)
            },
            select: {
                name: true,
                orders: true,
                dvlClient: true,
                library: true
            },
        }));
        return res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro" });
    }
}));
route.get("/dvl/:slug", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        const user = yield (prisma === null || prisma === void 0 ? void 0 : prisma.dvl.findMany({
            distinct: ["name"],
            where: {
                name: slug
            },
        }));
        return res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro" });
    }
}));
route.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dvls = yield (prisma === null || prisma === void 0 ? void 0 : prisma.dvl.findMany({
            distinct: ['name'],
            orderBy: {
                name: 'asc', // Ordena por nome para garantir consistência nos resultados
            },
            include: {
                user: true
            }
        }));
        return res.status(200).json(dvls);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro" });
    }
}));
route.get("/user-dvl", DVL_1.default.getAllCategories);
//payment 
route.post("/payment", MercadoPago_1.default);
route.post("/webhook", MercadoPago_2.WebHook);
//Payemnts and Orders
route.post("/order", MercadoPago_2.CreateOrder);
route.get("/teste", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send("funcionando");
}));
