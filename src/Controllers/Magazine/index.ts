import { Response, Request } from "express";
import prisma from "../../server/prisma";

class Magazine {
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
  async getAllMagazine(req: Request, res: Response) {
    try {
      const getMagazine = await prisma?.magazine.findMany({
        include: {
          article: true,
          Category:true
        },
      });

      return res.status(200).json(getMagazine);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  //Retorna uma categoria especifica
  async getOneMagazine(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const magazine = await prisma?.magazine.findUnique({
        where: { id: Number(slug) },
        select:{
          author:true,
          Category:true,
          cover:true,
          company:true,
          name:true,
          price:true,
          volume:true,
          id:true,
          description:true,
          article:{
            select:{
              author:true,
              company:true,
              description:true,
              name:true,
              price:true,
              cover:true,
              status:true,
              volume:true,
              id:true
            }
          }
        },
        
      });

      return res.status(200).json(magazine);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }

  //Cria uma categoria
  async createMagazine(req: Request, res: Response) {
    const {
      author,
      company,
      name,
      description,
      categoryId,
      price,
      volume,
      
     
    } = req.body;
    let ids
       const employes = JSON.parse(req.body.employes);
        
       
        for (const id of employes){
          ids = id.id
        }
       
      
      const {cover_file, pdf_file } = req.files as any
      const pdf = pdf_file[0]?.location
      const cover = cover_file[0]?.location
    try {
      await prisma?.$transaction(async (prisma) => {
        // Criar a revista no banco de dados
        const createMagazine = await prisma.magazine.create({
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
        });

        // Vincular a revista a cada funcionário
        for (const employee of employes) {
        
            const updateEmploye = await prisma.employee.update({
                where: { id: employee.id },
                data: {
                    magazines: {
                        connect: { id: createMagazine.id }
                    }
                }
            });
            console.log(updateEmploye)
        
        }
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
  async updateMagazine(req: Request, res: Response) {
    const { slug} = req.params
    const {
      
      author,
      company,
      name,
      description,
      categoryId,
      price,
      volume,
     
    } = req.body;
    console.log(slug)
      const {cover_file, pdf_file } = req.files as any
      const pdf = pdf_file[0]?.location
      const cover = cover_file[0]?.location

    if (!slug) {
      return res
        .status(404)
        .json({ message: "Não foi possivel atualizar o imóvel!" });
    }
    try {
      const updateMagazine = await prisma?.magazine.update({
        where: {
          id: Number(slug),
        },
        data: {
          author,
          company,
          name,
          description,
          magazine_pdf:pdf,
          price:Number(price),
          volume,
          cover:[cover],
          categoryId:Number(categoryId),
        },
      });
      return res
        .status(200)
        .json({ message: "Categoria atualizada com sucesso!" });
    } catch (error) {
       console.log(error)
      return this.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
    
  }
  //Delete uma categoria especifica
  async deleteMagazine(req: Request, res: Response) {
    const { id } = req.body;
    if (!id) {
      return res
        .status(403)
        .json({ message: "Não foi possível encontrar a categoria!" });
    }
    try {
      const deletMagazine = await prisma?.magazine.delete({
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

const MagazineController = new Magazine();
export default MagazineController;
