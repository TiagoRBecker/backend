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
class Article {
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
    //Retorna todas as categorias
    getAllArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMagazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.findMany({
                    include: {
                        magazine: true,
                        Category: true,
                    },
                }));
                return res.status(200).json(getMagazine);
            }
            catch (error) {
                console.log(error);
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    //Retorna uma categoria especifica
    getOneArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            const { status } = req.query;
            try {
                if (status === "free") {
                    const getArticle = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.findUnique({
                        where: { id: Number(slug) },
                        include: {
                            magazine: {
                                select: {
                                    id: true,
                                    name: true,
                                    company: true,
                                    cover: true,
                                    author: true
                                }
                            }
                        }
                    }));
                    return res.status(200).json(getArticle);
                }
                if (status === "trend") {
                    const getArticle = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.findUnique({
                        where: { id: Number(slug) },
                        select: {
                            id: true,
                            name: true,
                            author: true,
                            company: true,
                            cover: true,
                            price: true,
                            status: true,
                            volume: true,
                            description: true,
                            magazine: {
                                select: {
                                    id: true,
                                    name: true,
                                    company: true,
                                    cover: true,
                                    author: true
                                }
                            }
                        }
                    }));
                    return res.status(200).json(getArticle);
                }
                if (status === "recommended") {
                    const getArticle = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.findUnique({
                        where: { id: Number(slug) },
                        select: {
                            id: true,
                            name: true,
                            author: true,
                            company: true,
                            cover: true,
                            price: true,
                            status: true,
                            volume: true,
                            description: true,
                            magazine: {
                                select: {
                                    id: true,
                                    name: true,
                                    company: true,
                                    cover: true,
                                    author: true
                                }
                            }
                        }
                    }));
                    return res.status(200).json(getArticle);
                }
                if (status === "most-read") {
                    const getArticle = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.findUnique({
                        where: { id: Number(slug) },
                        select: {
                            id: true,
                            name: true,
                            author: true,
                            company: true,
                            cover: true,
                            price: true,
                            status: true,
                            volume: true,
                            description: true,
                            magazine: {
                                select: {
                                    id: true,
                                    name: true,
                                    company: true,
                                    cover: true,
                                    author: true
                                }
                            }
                        }
                    }));
                    return res.status(200).json(getArticle);
                }
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    getArticleRecommended(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getArticle = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.findMany({
                    where: {
                        status: "recommended"
                    },
                    select: {
                        id: true,
                        author: true,
                        company: true,
                        name: true,
                        description: true,
                        cover: true,
                        price: true,
                        status: true,
                        volume: true,
                    }
                }));
                return res.status(200).json(getArticle);
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    getArticleFree(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getArticle = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.findMany({
                    where: {
                        status: "free"
                    },
                    select: {
                        id: true,
                        author: true,
                        company: true,
                        name: true,
                        description: true,
                        cover: true,
                        price: true,
                        status: true,
                        volume: true,
                        articlepdf: true,
                        magazine: true
                    }
                }));
                return res.status(200).json(getArticle);
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    getArticleTrend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getArticle = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.findMany({
                    where: {
                        status: "trend"
                    },
                    select: {
                        id: true,
                        author: true,
                        company: true,
                        name: true,
                        description: true,
                        cover: true,
                        price: true,
                        status: true,
                        volume: true,
                    }
                }));
                return res.status(200).json(getArticle);
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    getArticleMostRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getArticle = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.findMany({
                    where: {
                        status: "most-read"
                    },
                    select: {
                        id: true,
                        author: true,
                        company: true,
                        name: true,
                        description: true,
                        cover: true,
                        price: true,
                        status: true,
                        volume: true,
                    }
                }));
                return res.status(200).json(getArticle);
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    //Cria uma categoria
    createArticle(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { author, company, name, description, price, volume, categoryId, magazineId, status } = req.body;
            const { cover_file, pdf_file } = req.files;
            const pdf = (_a = pdf_file[0]) === null || _a === void 0 ? void 0 : _a.location;
            const cover = (_b = cover_file[0]) === null || _b === void 0 ? void 0 : _b.location;
            try {
                const createArticle = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.create({
                    data: {
                        author,
                        company,
                        name,
                        description,
                        articlepdf: pdf,
                        price: Number(price),
                        volume,
                        cover: cover,
                        magazineId: Number(magazineId),
                        categoryId: Number(categoryId),
                        status: status
                    },
                }));
                return res.status(200).json({ message: "Categoria criada com sucesso!" });
            }
            catch (error) {
                console.log(error);
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    //Atualiza uma categoria especifica
    updateArticle(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            const { author, company, name, description, price, volume, categoryId, magazineId, status } = req.body;
            const { cover_file, pdf_file } = req.files;
            const pdf = (_a = pdf_file[0]) === null || _a === void 0 ? void 0 : _a.location;
            const cover = (_b = cover_file[0]) === null || _b === void 0 ? void 0 : _b.location;
            if (!slug) {
                return res
                    .status(404)
                    .json({ message: "Não foi possivel atualizar o imóvel!" });
            }
            try {
                const updateArticle = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.update({
                    where: {
                        id: Number(slug),
                    },
                    data: {
                        author,
                        company,
                        name,
                        description,
                        articlepdf: pdf,
                        price: Number(price),
                        volume,
                        cover: cover,
                        magazineId: Number(magazineId),
                        categoryId: Number(categoryId),
                        status: status
                    },
                }));
                return res
                    .status(200)
                    .json({ message: "Categoria atualizada com sucesso!" });
            }
            catch (error) {
                return this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    //Delete uma categoria especifica
    deleteArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id) {
                return res
                    .status(403)
                    .json({ message: "Não foi possível encontrar a categoria!" });
            }
            try {
                const deletMagazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.article.delete({
                    where: {
                        id: Number(id),
                    },
                }));
                return res
                    .status(200)
                    .json({ message: "Categoria deletado com sucesso!" });
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
}
const ArticleController = new Article();
exports.default = ArticleController;
