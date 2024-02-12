import { Response, Request } from "express";
import prisma from "../../server/prisma";

class DVL {
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
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await prisma?.category.findMany({
        include:{
            magazine:true,
            article:true
        }
      });

      return res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  //Retorna uma categoria especifica
  async getOneCategory(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const categoryOne = await prisma?.category.findUnique({
        where: { id: Number(slug) },
        include:{
          magazine:true
        }
      });

      return res.status(200).json(categoryOne);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }

  //Cria uma categoria
  async createDVL(req: Request, res: Response) {
    const {
        name,paidOut,toReceive,userId
    } = req.body;
    try {
      const createMagazine = await prisma?.dvl.create({
        data: {
          name,paidOut,toReceive,userId
        },
      });
      return res.status(200).json({ message: "Categoria criada com sucesso!" });
    } catch (error) {
         console.log(error)
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  //Atualiza uma categoria especifica
  async updateCategory(req: Request, res: Response) {
    const { slug, editCategory } = req.body;

    if (!slug) {
      return res
        .status(404)
        .json({ message: "Não foi possivel atualizar o imóvel!" });
    }
    try {
      const updateCategory = await prisma?.category.update({
        where: {
          id: Number(slug),
        },
        data: {
          name: editCategory,
        },
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
  async deleteCategory(req: Request, res: Response) {
    const { id } = req.body;
    if (!id) {
      return res
        .status(403)
        .json({ message: "Não foi possível encontrar a categoria!" });
    }
    try {
      const deletCategory = await prisma?.category.delete({
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

const DvlController = new DVL();
export default DvlController;
