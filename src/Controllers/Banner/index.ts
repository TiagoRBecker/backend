import { Response, Request } from "express";
import prisma from "../../server/prisma";
class Banner {
  async getAllBanners(req: Request, res: Response) {
    const covers = await prisma?.banner.findMany({
        take:4
    });

    return res.status(200).json(covers);
  }
  async createBanner(req: Request, res: Response) {
    const { name} = req.body
    const {location} = req.file as any
    const createBanner = await prisma?.banner.create({
        data:{
            name,
            cover:location
        }
    });
     console.log(createBanner)
    return res.status(200).json({message:"Banner criado com sucesso"});
  }
 
 
  async deletBanner(req: Request, res: Response) {
    const {slug} = req.params

    const createCover = await prisma?.banner.delete({
      where:{
        id:Number(slug)
      }
    });
   
    return res.status(200).json({ message: "Banner Deletado com sucesso" });
  }
}
const BannerController = new Banner();
export default BannerController;
