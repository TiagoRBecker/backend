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
class Employee {
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
    getAllEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllEmployee = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.employee.findMany({
                    include: {
                        magazines: true
                    }
                }));
                return res.status(200).json(getAllEmployee);
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    getOneEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            const getOneEmployee = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.employee.findUnique({
                where: {
                    id: Number(slug)
                },
                include: {
                    magazines: true
                }
            }));
            return res.status(200).json(getOneEmployee);
        });
    }
    createEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, profession, phone } = req.body;
            const profile = req === null || req === void 0 ? void 0 : req.file;
            try {
                const create = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.employee.create({
                    data: {
                        name,
                        email,
                        profession,
                        phone,
                        password,
                        avatar: profile.location
                    }
                }));
                return res.status(200).json({ message: "Colaborador criado com sucesso!" });
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
    editEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            const { name, email, profession, phone } = req.body;
            const profile = req === null || req === void 0 ? void 0 : req.file;
            try {
                if (profile && profile.location) {
                    const update = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.employee.update({
                        where: {
                            id: Number(slug)
                        },
                        data: {
                            name,
                            email,
                            profession,
                            phone,
                            avatar: profile.location
                        }
                    }));
                    return res.status(200).json({ message: "Colaborador editado com sucesso!" });
                }
                else {
                    const update = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.employee.update({
                        where: {
                            id: Number(slug)
                        },
                        data: {
                            name,
                            email,
                            profession,
                            phone,
                        }
                    }));
                    return res.status(200).json({ message: "Colaborador editado com sucesso!" });
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
    deletEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id) {
                return res.status(404).json({ message: "Colaborador não encontrado!" });
            }
            try {
                const deletEmployee = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.employee.delete({
                    where: {
                        id: Number(id)
                    }
                }));
                return res.status(200).json({ message: "Colaborador deletado com sucesso" });
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
}
const EmployeeController = new Employee();
exports.default = EmployeeController;
