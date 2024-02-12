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
class Magazine {
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
    getAllMagazine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMagazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.magazine.findMany({
                    include: {
                        article: true,
                        Category: true
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
    getOneMagazine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            try {
                const magazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.magazine.findUnique({
                    where: { id: Number(slug) },
                    select: {
                        author: true,
                        Category: true,
                        cover: true,
                        company: true,
                        name: true,
                        price: true,
                        volume: true,
                        id: true,
                        description: true,
                        article: {
                            select: {
                                author: true,
                                company: true,
                                description: true,
                                name: true,
                                price: true,
                                cover: true,
                                status: true,
                                volume: true,
                                id: true
                            }
                        }
                    },
                }));
                return res.status(200).json(magazine);
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
    createMagazine(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { author, company, name, description, categoryId, price, volume, } = req.body;
            const { cover_file, pdf_file } = req.files;
            const pdf = (_a = pdf_file[0]) === null || _a === void 0 ? void 0 : _a.location;
            const cover = (_b = cover_file[0]) === null || _b === void 0 ? void 0 : _b.location;
            try {
                const createMagazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.magazine.create({
                    data: {
                        author,
                        company,
                        name,
                        description,
                        magazine_pdf: pdf,
                        price: Number(price),
                        volume,
                        cover: [cover],
                        categoryId: Number(categoryId),
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
    updateMagazine(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            const { author, company, name, description, categoryId, price, volume, } = req.body;
            console.log(slug);
            const { cover_file, pdf_file } = req.files;
            const pdf = (_a = pdf_file[0]) === null || _a === void 0 ? void 0 : _a.location;
            const cover = (_b = cover_file[0]) === null || _b === void 0 ? void 0 : _b.location;
            if (!slug) {
                return res
                    .status(404)
                    .json({ message: "Não foi possivel atualizar o imóvel!" });
            }
            try {
                const updateMagazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.magazine.update({
                    where: {
                        id: Number(slug),
                    },
                    data: {
                        author,
                        company,
                        name,
                        description,
                        magazine_pdf: pdf,
                        price: Number(price),
                        volume,
                        cover: [cover],
                        categoryId: Number(categoryId),
                    },
                }));
                return res
                    .status(200)
                    .json({ message: "Categoria atualizada com sucesso!" });
            }
            catch (error) {
                console.log(error);
                return this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    //Delete uma categoria especifica
    deleteMagazine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id) {
                return res
                    .status(403)
                    .json({ message: "Não foi possível encontrar a categoria!" });
            }
            try {
                const deletMagazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.magazine.delete({
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
const MagazineController = new Magazine();
exports.default = MagazineController;
