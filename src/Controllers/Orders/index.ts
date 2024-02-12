import { Response, Request } from "express";
import prisma from "../../server/prisma";

class Orders {
  //Funçao para tratar dos erros no servidor
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  //Retorna todas as categorias
  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await prisma?.order.findMany({
       
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  //Retorna uma categoria especifica
  async getOneOrder(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const getOrder = await prisma?.order.findUnique({
        where: { id: Number(slug) },
       
      });

      return res.status(200).json(getOrder);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }

 
  //Atualiza uma categoria especifica
  async updateOrder(req: Request, res: Response) {
    const { slug ,name} = req.body;

    if (!slug) {
      return res
        .status(404)
        .json({ message: "Não foi possivel atualizar o imóvel!" });
    }
    try {
      const updateOrder = await prisma?.order.update({
        where: {
          id: Number(slug),
        },
        data: {
         items:[name]
        }
      });
      return res
        .status(200)
        .json({ message: "Categoria atualizada com sucesso!" });
    } catch (error) {
      return this.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  //Delete uma categoria especifica
  async deletOrder(req: Request, res: Response) {
    const { id } = req.body;
    if (!id) {
      return res
        .status(403)
        .json({ message: "Não foi possível encontrar a categoria!" });
    }
    try {
      const deletOrder = await prisma?.order.delete({
        where: {
          id: Number(id),
        },
      });
      return res
        .status(200)
        .json({ message: "Categoria deletado com sucesso!" });
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
}

const OrdersController = new Orders();
export default OrdersController;
