import { Response, Request } from "express";
import prisma from "../../server/prisma";
import jwt from "jsonwebtoken"
class Auth {
  //Funçao para tratar dos erros no servidor
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }

  async createAccount(req: Request, res: Response) {
    const {
      name,
      lastName,
      district,
      password,
      email,
      cep,
      adress,
      city,
      complement,
      numberAdress,
    } = req.body;
    
     const chekingEmail = await prisma?.user.findUnique({
        where:{
            email:email
        }
     })
     if(chekingEmail){
       throw new Error("E-mail já cadastrado no banco de dados!");
       
     }
    try {
        const create = await prisma?.user.create({
            data: {
              name,
              lastName,
              password,
              email,
              cep,
              adress,
              city,
              complement,
              numberAdress,
              district
      
            },
          });
          return res.status(200).json({message:"Conta criada com sucesso!"})
    } catch (error) {
        return this?.handleError(error,res)
    }
    finally{
        return this?.handleDisconnect()
    }

    
  }
  async authentication(req: Request, res: Response) {
    const {
      credentials
    } = req.body;
    const chekingEmail = await prisma?.user.findUnique({
      where:{
          email:credentials.email
      }
   })
   if(!chekingEmail){
     
     return res.status(404).json({message:"E-mail não cadastrado no sistema!"})
     
   }
     const user = await prisma?.user.findUnique({
        where:{
            email:credentials.email,
            password:credentials.password
        }
     })
     if(!user){
      return res.status(401).json({message:"E-mail ou senha invalidos"})
     }
     if(user){
        const token = jwt.sign({
            id:user?.id ,
            name:user?.name ,
            email:user?.email,
            


        },process.env.SECRET as string ,{ expiresIn:"1d"})
        
        return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        adress: user.adress,
        cep: user.cep,
        numberAdress: user.numberAdress,
        complement: user.complement,
        district:user.district,
        accessToken: token,
        })
     }
     else{
        return res.status(404).json({message:"E-mail ou senha invalidos"})
     }

    
  }
}
const AuthControllers = new Auth();
export default AuthControllers;