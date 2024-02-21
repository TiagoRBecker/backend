import { Response, Request } from "express";
import prisma from "../../server/prisma";

class Article {
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
  async getAllArticle(req: Request, res: Response) {
    
    try {
       const { page} = req.query
      if(page){
        
        const take = 6;
        const numberPage = (Number(page) - 1) * take;
        const getArticles = await prisma?.article.findMany({
          take: take,
          skip: Number(numberPage),

          include: {
            magazine: true,
            Category: true,
          },
        });
        const listCount: any = await prisma?.article.count();
        const finalPage = Math.ceil(listCount / take);

        return res
          .status(200)
          .json({ getArticles, finalPage });
        
      }
      else{
        const { author, name, company, volume, category, take } = req.query;
        const getArticleFilter = await prisma?.article.findMany({
          take:Number(take) || 100,
          where: {
            name: {
              contains: (name as string) || "",
              mode: "insensitive",
            },
            author: {
              contains: (author as string) || "",
              mode: "insensitive",
            },
            company: {
              contains: (company as string) || "",
              mode: "insensitive",
            },
            volume: {
              contains: (volume as string) || "",
              mode: "insensitive",
            },
            Category: {
              name: {
                contains: category as string,
                mode: "insensitive",
              },
            },
          },
          include: {
            magazine: true,
            Category: true,
          },
        });
        return res.status(200).json(getArticleFilter);
      }


      
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getOneArticleEdit(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const getArticle = await prisma?.article.findUnique({
        where: { id: Number(slug) },
        include: {
          magazine: {
            select: {
              id: true,
              name: true,
              company: true,
              cover: true,
              author: true,
            },
          },
        },
      });
      return res.status(200).json(getArticle);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  //Retorna uma categoria especifica
  async getOneArticle(req: Request, res: Response) {
    const { slug } = req.params;
    const { status } = req.query;

    try {
      if (status === "free") {
        const getArticle = await prisma?.article.findUnique({
          where: { id: Number(slug) },
          include: {
            magazine: {
              select: {
                id: true,
                name: true,
                company: true,
                cover: true,
                author: true,
              },
            },
          },
        });
        return res.status(200).json(getArticle);
      }
      if (status === "trend") {
        const getArticle = await prisma?.article.findUnique({
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
                author: true,
              },
            },
          },
        });
        return res.status(200).json(getArticle);
      }
      if (status === "recommended") {
        const getArticle = await prisma?.article.findUnique({
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
                author: true,
              },
            },
          },
        });
        return res.status(200).json(getArticle);
      }
      if (status === "most-read") {
        const getArticle = await prisma?.article.findUnique({
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
                author: true,
              },
            },
          },
        });
        return res.status(200).json(getArticle);
      }
      return res.json(404).json([])
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getArticleRecommended(req: Request, res: Response) {
    try {
      const getArticle = await prisma?.article.findMany({
        where: {
          status: "recommended",
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
        },
      });

      return res.status(200).json(getArticle);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getArticleFree(req: Request, res: Response) {
    try {
      const getArticle = await prisma?.article.findMany({
        where: {
          status: "free",
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
          magazine: true,
        },
      });

      return res.status(200).json(getArticle);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getArticleTrend(req: Request, res: Response) {
    try {
      const getArticle = await prisma?.article.findMany({
        where: {
          status: "trend",
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
        },
      });

      return res.status(200).json(getArticle);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getArticleMostRead(req: Request, res: Response) {
    try {
      const getArticle = await prisma?.article.findMany({
        where: {
          status: "most-read",
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
        },
      });

      return res.status(200).json(getArticle);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }

  //Admin Routes 
  async createArticle(req: Request, res: Response) {
    const {
      author,
      company,
      name,
      description,
      price,
      volume,
      categoryId,
      magazineId,
      capa_name,
      status,
    } = req.body;

    const { cover_file, pdf_file } = req.files as any;
    const pdf = pdf_file[0]?.location;
    const cover = cover_file[0]?.location;
    try {
      const createArticle = await prisma?.article.create({
        data: {
          author,
          company,
          name,
          description,
          articlepdf: pdf,
          price: Number(price),
          volume,
          cover: cover,
          capa_name:capa_name,
          magazineId: Number(magazineId),
          categoryId: Number(categoryId),
          status: status,
        },
      });
      return res.status(200).json({ message: "Categoria criada com sucesso!" });
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  
  async updateArticle(req: Request, res: Response) {
    const { slug } = req.params;
    
    if (!slug) {
      return res
        .status(404)
        .json({ message: "Não foi possivel atualizar o imóvel!" });
    }
    try {
      const {
        author,
        company,
        name,
        description,
        price,
        volume,
        categoryId,
        magazineId,
        capa_name,
        status,
      } = req.body;
  
      let pdf = "";
      let cover:any;
      if (req?.files) {
        const { new_cover_file, new_pdf_file } = req.files as any;
        if (new_cover_file) {
          cover = new_cover_file[0]?.location;
        }
        if (new_pdf_file) {
          pdf = new_pdf_file[0]?.location;
        }
      }
      const updateData: any = {
        author,
        company,
        name,
        description,
        price: Number(price),
        volume,
        capa_name,
        categoryId: Number(categoryId),
        magazineId:Number(magazineId),
        status:status
      };
      if (req?.files && cover) {
        updateData.cover = cover;
      }
      if (req?.files && pdf) {
        updateData.articlepdf = pdf;
      }
      const updateArticle = await prisma?.article.update({
        where: {
          id: Number(slug),
        },
        data:updateData
      });
      return res
        .status(200)
        .json({ message: "Artigo atualizada com sucesso!" });
    } catch (error) {
      console.log(error)
      return this.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
    
  }

  async deleteArticle(req: Request, res: Response) {
    const { id } = req.body;
    if (!id) {
      return res
        .status(403)
        .json({ message: "Não foi possível encontrar a categoria!" });
    }
    try {
      const deletMagazine = await prisma?.article.delete({
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

const ArticleController = new Article();
export default ArticleController;
