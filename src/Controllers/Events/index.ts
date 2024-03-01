import { Response, Request } from "express";
import prisma from "../../server/prisma";
class Events {
  async getAllEvents(req: Request, res: Response) {
    const covers = await prisma?.event.findMany({
      include: {
        cover: true,
      },
    });

    return res.status(200).json(covers);
  }
  async getAllCovers(req: Request, res: Response) {
    const covers = await prisma?.cover.findMany({});

    return res.status(200).json(covers);
  }
  async addVoteCover(req: Request, res: Response) {
    const { slug } = req.params
    const { id} = req.body
    const checkUser = await prisma?.cover.findFirst({
      where:{
        id:Number(slug),
        userId:Number(id)
      }
    })
    
    if(checkUser){
      return res.status(403).json({message:"Voçê já votou!"})
    }
    const covers = await prisma?.cover.update({
      where:{
        id:Number(slug)
      },
      data: {
        countLike: {
          increment: 1 
        },
        userId:Number(id)
      }
    });

   
    return res.status(200).json({message:"Voto confirmado com sucesso "});
    
  }
  async createEvents(req: Request, res: Response) {
    const { name, date_event, selectedValues } = req.body;

    await prisma?.$transaction(async (prisma) => {
        const ids = selectedValues.map((id:any) => parseInt(id));
        const getCovers = await prisma.cover.findMany({
          where: {
            id: {
              in: ids,
            },
          },
        });
    
        // Cria o evento
        const createEvent = await prisma.event.create({
          data: {
            name,
            date_event: String(date_event),
            // Conecta as capas ao evento usando o relacionamento definido no schema
            cover: {
              // Mapeia as capas selecionadas para o formato exigido pelo Prisma
              connect: getCovers.map((cover) => ({ id: cover.id })),
            },
          },
          // Inclui as capas associadas ao evento no resultado
          include: {
            cover: true,
          },
        });
    
        console.log(createEvent);
        return res.status(200).json({ message: "Evento criado com sucesso", data: createEvent });
      });
  }
  async createCoverEvents(req: Request, res: Response) {
    const { name } = req.body;
    const { location } = req.file as any;
    const createCover = await prisma?.cover.create({
      data: {
        name: name,
        cover: location,
      },
    });
    console.log(createCover);
    return res.status(200).json({ message: "Criado com sucesso" });
  }
  async deletEvent(req: Request, res: Response) {
    const {slug} = req.params
   console.log(slug)
    const createCover = await prisma?.event.delete({
      where:{
        id:Number(slug)
      }
    });
   
    return res.status(200).json({ message: "Evento Deletado com sucesso" });
  }
}
const EventController = new Events();
export default EventController;
