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
class Orders {
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
    getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.order.findMany({}));
                return res.status(200).json(orders);
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
    getOneOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            try {
                const getOrder = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.order.findUnique({
                    where: { id: Number(slug) },
                }));
                return res.status(200).json(getOrder);
            }
            catch (error) {
                return this === null || this === void 0 ? void 0 : this.handleError(error, res);
            }
            finally {
                return this === null || this === void 0 ? void 0 : this.handleDisconnect();
            }
        });
    }
    //Atualiza uma categoria especifica
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug, name } = req.body;
            if (!slug) {
                return res
                    .status(404)
                    .json({ message: "Não foi possivel atualizar o imóvel!" });
            }
            try {
                const updateOrder = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.order.update({
                    where: {
                        id: Number(slug),
                    },
                    data: {
                        items: [name]
                    }
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
    deletOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id) {
                return res
                    .status(403)
                    .json({ message: "Não foi possível encontrar a categoria!" });
            }
            try {
                const deletOrder = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.order.delete({
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
const OrdersController = new Orders();
exports.default = OrdersController;
