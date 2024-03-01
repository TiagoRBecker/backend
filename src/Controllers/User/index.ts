import { Response, Request } from "express";
import prisma from "../../server/prisma";

class User  {
    private handleError(error: any, res: Response) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      //Função para desconetar o orm prisma
      private async handleDisconnect() {
        return await prisma?.$disconnect();
      }
    async getOneUser(req:Request,res:Response){
        const  {slug} = req.params
         console.log(slug)
        try {
            const getUser = await prisma?.user.findUnique({
                where:{
                    id:Number(slug)
                },
                select:{
                    name:true,
                    lastName:true,
                    email:true,
                    id:true,
                    city:true,
                    adress:true,
                    cep:true,
                    district:true,
                    complement:true,
                    numberAdress:true,
                    dvlClient:true,
                    library:true,
                    orders:true

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
        
        
    }
    async changePassUser(req:Request,res:Response){
         const { data, id} = req.body
     const getUser = await prisma?.user.findUnique({where:{id:Number(id)}})
      if(data.password === getUser?.password){
          console.log("Usuario pode alterar a senha")
      }
      else{
        console.log("Senha invalida ")
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
        
        
    }
    async updateUser(req:Request,res:Response){
      console.log(req.body)
      return res.status(200).json()
    }
    async deletUser(){

    }
    async getLibraryUser(req:Request,res:Response){
        const {name} = req.query
        const { slug} = req.params
        console.log("Aqui",slug)
        try {
            const request = await prisma?.library_teste.findMany({
                where:{
                    userId:Number(slug),
                    name:{
                        contains:name as string || "",
                        mode:"insensitive"

                    },
                    
                     
                },
                select:{
                    id:true,
                    cover:true,
                    name:true,
                    Category:true
                }
            })
            return res.status(200).json(request)
        } catch (error) {
            return this?.handleError(error,res)
        }
        finally{
            return this?.handleDisconnect()
        }
       
    }
    async getOneBookLibraryUser(req:Request,res:Response){
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        const { slug} = req.params
      
        try {
            const request = await prisma?.library_teste.findUnique({
             where:{
                id:Number(slug)
             },
             select:{
                magazine_pdf:true
             }
                
            })
            return res.status(200).json(request)
        } catch (error) {
            return this?.handleError(error,res)
        }
        finally{
            return this?.handleDisconnect()
        }
       
    }
}

const UserController = new User()
export default UserController