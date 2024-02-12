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
class User {
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
    getOneUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = req.params;
            console.log(slug);
            try {
                const getUser = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.user.findUnique({
                    where: {
                        id: Number(slug)
                    },
                    select: {
                        name: true,
                        lastName: true,
                        email: true,
                        id: true,
                        city: true,
                        adress: true,
                        cep: true,
                        district: true,
                        complement: true,
                        numberAdress: true,
                        dvlClient: true,
                        library: true,
                        orders: true
                    }
                }));
                return res.status(200).json(getUser);
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
    changePassUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, id } = req.body;
            const getUser = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.user.findUnique({ where: { id: Number(id) } }));
            if (data.password === (getUser === null || getUser === void 0 ? void 0 : getUser.password)) {
                console.log("Usuario pode alterar a senha");
            }
            else {
                console.log("Senha invalida ");
            }
            /* try {
                 const getUser = await prisma?.user.update({
                     where:{
                         id:Number(id)
                     },
                     data:{
                         password:data.password
                     }
                 })
                 return res.status(200).json(getUser)
             } catch (error) {
                 console.log(error)
                 return this?.handleError(error,res)
             }
             finally{
                 return this?.handleDisconnect()
             }
             */
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            return res.status(200).json();
        });
    }
    deletUser() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
const UserController = new User();
exports.default = UserController;
