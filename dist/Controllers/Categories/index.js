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
class Categories {
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
    getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.category.findMany({
                    include: {
                        magazine: true,
                        article: true,
                    },
                }));
                return res.status(200).json(categories);
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
    getOneCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            try {
                const categoryOne = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.category.findUnique({
                    where: { id: Number(slug) },
                    include: {
                        magazine: {
                            select: {
                                author: true,
                                Category: true,
                                cover: true,
                                company: true,
                                name: true,
                                price: true,
                                volume: true,
                                id: true,
                                description: true
                            },
                        },
                    },
                }));
                return res.status(200).json(categoryOne);
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
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category } = req.body;
            try {
                const createMagazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.category.create({
                    data: {
                        name: category,
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
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug, editCategory } = req.body;
            if (!slug) {
                return res
                    .status(404)
                    .json({ message: "Não foi possivel atualizar o imóvel!" });
            }
            try {
                const updateCategory = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.category.update({
                    where: {
                        id: Number(slug),
                    },
                    data: {
                        name: editCategory,
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
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id) {
                return res
                    .status(403)
                    .json({ message: "Não foi possível encontrar a categoria!" });
            }
            try {
                const deletCategory = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.category.delete({
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
const CategoriesController = new Categories();
exports.default = CategoriesController;
