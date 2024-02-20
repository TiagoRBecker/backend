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
                if (req.query) {
                    const { author, name, company, volume, category, take } = req.query;
                    const takeValue = Number(take);
                    const getMagazineFilter = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.magazine.findMany({
                        take: takeValue || 10,
                        where: {
                            name: {
                                contains: name || "",
                                mode: "insensitive",
                            },
                            author: {
                                contains: author || "",
                                mode: "insensitive",
                            },
                            company: {
                                contains: company || "",
                                mode: "insensitive",
                            },
                            volume: {
                                contains: volume || "",
                                mode: "insensitive",
                            },
                            Category: {
                                name: {
                                    contains: category,
                                    mode: "insensitive",
                                },
                            },
                        },
                        include: {
                            article: true,
                            Category: true,
                        },
                    }));
                    return res.status(200).json(getMagazineFilter);
                }
                else {
                    const getMagazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.magazine.findMany({
                        include: {
                            article: true,
                            Category: true,
                        },
                    }));
                    return res.status(200).json(getMagazine);
                }
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
    getLastMagazines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getLastMagazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.magazine.findMany({
                    take: 4,
                    orderBy: {
                        createDate: "asc",
                    },
                    select: {
                        id: true,
                        name: true,
                        author: true,
                        company: true,
                        cover: true,
                        volume: true,
                    },
                }));
                return res.status(200).json(getLastMagazine);
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
                        magazine_pdf: true,
                        employees: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
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
                                id: true,
                            },
                        },
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
    //Admin Routes
    getOneMagazineEdit(req, res) {
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
                        magazine_pdf: true,
                        employees: true,
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
    createMagazine(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { author, company, name, description, categoryId, price, volume, capa_name } = req.body;
            const employes = JSON.parse(req.body.employes);
            const { cover_file, pdf_file } = req.files;
            const pdf = (_a = pdf_file[0]) === null || _a === void 0 ? void 0 : _a.location;
            const cover = (_b = cover_file[0]) === null || _b === void 0 ? void 0 : _b.location;
            try {
                yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    // Criar a revista no banco de dados
                    const createMagazine = yield prisma.magazine.create({
                        data: {
                            author,
                            company,
                            name,
                            description,
                            magazine_pdf: pdf,
                            price: Number(price),
                            capa_name,
                            volume,
                            cover: [cover],
                            categoryId: Number(categoryId),
                        },
                    });
                    // Vincular a revista a cada funcionário
                    for (const employee of employes) {
                        const updateEmploye = yield prisma.employee.update({
                            where: { id: employee.id },
                            data: {
                                magazines: {
                                    connect: { id: createMagazine.id },
                                },
                            },
                        });
                    }
                })));
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
    updateMagazine(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            if (!slug) {
                return res
                    .status(404)
                    .json({ message: "Náo foi possivel localizar a revista!" });
            }
            try {
                const { author, company, name, description, categoryId, price, volume, capa_name, } = req.body;
                const employes = JSON.parse(req.body.employes);
                let pdf = "";
                let cover;
                if (req === null || req === void 0 ? void 0 : req.files) {
                    const { new_cover_file, new_pdf_file } = req.files;
                    if (new_cover_file) {
                        cover = [(_a = new_cover_file[0]) === null || _a === void 0 ? void 0 : _a.location];
                    }
                    if (new_pdf_file) {
                        pdf = (_b = new_pdf_file[0]) === null || _b === void 0 ? void 0 : _b.location;
                    }
                }
                yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    const updateData = {
                        author,
                        company,
                        name,
                        description,
                        price: Number(price),
                        volume,
                        capa_name,
                        categoryId: Number(categoryId),
                    };
                    if ((req === null || req === void 0 ? void 0 : req.files) && cover) {
                        updateData.cover = [cover];
                    }
                    if ((req === null || req === void 0 ? void 0 : req.files) && pdf) {
                        updateData.magazine_pdf = pdf;
                    }
                    const updateMagazine = yield (prisma === null || prisma === void 0 ? void 0 : prisma.magazine.update({
                        where: {
                            id: Number(slug),
                        },
                        data: updateData,
                    }));
                    for (const employee of employes) {
                        const updateEmploye = yield prisma.employee.update({
                            where: { id: employee.id },
                            data: {
                                magazines: {
                                    connect: { id: updateMagazine.id },
                                },
                            },
                        });
                    }
                    return res
                        .status(200)
                        .json({ message: "Categoria atualizada com sucesso!" });
                })));
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
    deleteEmployeeMagazine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug, id } = req.body;
            if (!slug) {
                return res
                    .status(403)
                    .json({ message: "Não foi possível encontrar a categoria!" });
            }
            try {
                const deletEmployeeMagazine = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.magazine.update({
                    where: {
                        id: Number(slug),
                    },
                    data: {
                        employees: {
                            disconnect: {
                                id: Number(id),
                            },
                        },
                    },
                }));
                return res
                    .status(200)
                    .json({ message: "Colaborador removido  com sucesso!" });
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
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
