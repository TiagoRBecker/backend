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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrder = exports.WebHook = void 0;
const mercadopago_1 = require("mercadopago");
const mercadoPago = new mercadopago_1.MercadoPagoConfig({
    accessToken: "TEST-5209000350365804-012112-78908f97b5f3d4d1b9b3627c2e1676f9-1440745780",
});
const preference = new mercadopago_1.Preference(mercadoPago);
const payment = new mercadopago_1.Payment(mercadoPago);
const GatwayPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cart } = req.body;
    const items = cart.map((items) => {
        return {
            id: items.id,
            title: items.name,
            unit_price: items.price,
            currency_id: "BRL",
            picture_url: items.cover[0],
            quantity: 1,
        };
    });
    try {
        const createPreference = yield preference.create({
            body: {
                back_urls: {
                    success: "http://localhost:3000/sucess",
                    failure: "http://localhost:3000/failure",
                },
                items: items,
                payment_methods: {
                    installments: 4,
                    excluded_payment_types: [
                        {
                            id: "ticket",
                        },
                    ],
                },
                auto_return: "approved",
                metadata: {
                    userID: 1,
                    products: items,
                },
            },
        });
        return res.status(200).json({ id: createPreference.id });
    }
    catch (error) {
        console.log(error);
    }
});
const WebHook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    if (data.id) {
        try {
            const getStatus = yield payment.get({ id: data.id });
            const satusPayment = getStatus.status;
            const metadata = getStatus.metadata;
            if (satusPayment === "approved") {
                const createOrder = yield (prisma === null || prisma === void 0 ? void 0 : prisma.order.create({
                    data: {
                        status: satusPayment,
                        items: metadata.products,
                        userId: metadata.user_id,
                    },
                }));
                const dvlItems = getStatus.metadata.products.map((items) => {
                    return {
                        name: items.title,
                        price: items.unit_price,
                        toReceive: 0,
                        picture: items.picture_url,
                        paidOut: items.unit_price,
                        userId: metadata.user_id,
                    };
                });
                const createDvlItems = yield (prisma === null || prisma === void 0 ? void 0 : prisma.dvl.createMany({
                    data: dvlItems,
                }));
                console.log(createDvlItems);
                return res.status(200).json({ message: "Order criada com sucesso" });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
});
exports.WebHook = WebHook;
const CreateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getOrder = yield payment.get({ id: "1320964195" });
    try {
        const satusPayment = getOrder.status;
        const metadata = getOrder.metadata;
        if (satusPayment === "approved") {
            const createOrder = yield (prisma === null || prisma === void 0 ? void 0 : prisma.order.create({
                data: {
                    status: satusPayment,
                    items: metadata.products,
                    userId: 1,
                },
            }));
            const dvlItems = metadata.products.map((items) => {
                return {
                    name: items.title,
                    price: items.unit_price,
                    toReceive: 0,
                    picture: items.picture_url,
                    paidOut: items.unit_price,
                    userId: metadata.user_id,
                };
            });
            const createDvlItems = yield (prisma === null || prisma === void 0 ? void 0 : prisma.dvl.createMany({
                data: dvlItems,
            }));
            const userId = 1; // Substitua pelo ID do usuário desejado
            const novaRevista = {
                " name": "Nova Revista",
                " teste": "Nova Revista",
                " article": "Nova Revista",
                "pdf": "url_do_pdf_da_revista",
            };
            const teste = ["arra de sting"];
            const usuario = yield (prisma === null || prisma === void 0 ? void 0 : prisma.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    library: true, // Inclua a biblioteca do usuário na consulta
                },
            }));
            if (usuario) {
                const userCreate = yield (prisma === null || prisma === void 0 ? void 0 : prisma.user.update({
                    where: {
                        id: 1
                    },
                    data: {
                        library: {
                            create: {
                                author: "Leonardo",
                                cover: ["https://plashmagazine.s3.sa-east-1.amazonaws.com/4-039e3b82-6b05-4c07-9229-09fb6e88e807.png"],
                                magazine_pdf: "https://plashmagazine.s3.sa-east-1.amazonaws.com/vol4-tiopiks-b5c7546d-6440-4c5f-a4d6-5ab702df0d0f.pdf",
                                name: "Skate na veia 4",
                                categoryId: 1
                            },
                        }
                    }
                }));
                return res.status(200).json(userCreate);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.CreateOrder = CreateOrder;
exports.default = GatwayPayment;