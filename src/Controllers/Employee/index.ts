import { Response, Request } from "express";
import prisma from "../../server/prisma";
class Employee {
    //Funçao para tratar dos erros no servidor
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
 async getAllEmployees(req:Request,res:Response){
  try {
    const getAllEmployee = await prisma?.employee.findMany({
      include:{
        magazines:true
      }
    })
    return res.status(200).json(getAllEmployee)
  } catch (error) {
    return this?.handleError(error,res)
  }
  finally{
    return this?.handleDisconnect()
  }
 }
 async getOneEmployee(req:Request,res:Response){
    const {slug} = req.params
    
    const getOneEmployee = await prisma?.employee.findUnique({
        where:{
            id:Number(slug)
        },
        include:{
          magazines:true
        }
    })
    return res.status(200).json(getOneEmployee)
 }
 async createEmployee(req:Request,res:Response){
    const {name,email,password,profession,phone} =req.body
    const profile = req?.file as any
    
    try {
        const create = await prisma?.employee.create({
            data:{
                name,
                email,
                profession,
                phone,
                password,
                avatar:profile.location as any
            }
           })
           return res.status(200).json({message:"Colaborador criado com sucesso!"})
    } catch (error) {
        console.log(error)
        return this?.handleError(error,res)
    }
    finally{
        return this?.handleDisconnect()
    }
   
   
   
 
 }
 async editEmployee(req:Request,res:Response){
    const {slug} = req.params
    const {name,email,profession,phone} = req.body
    const profile = req?.file as any
    try {
        if(profile && profile.location){
            const update = await prisma?.employee.update({
                where:{
                    id:Number(slug)
                },
                data:{
                    name,
                    email,
                    profession,
                    phone,
                    avatar:profile.location
                    
                   
                }
               })
               return res.status(200).json({message:"Colaborador editado com sucesso!"})
        }
        else{
            const update = await prisma?.employee.update({
                where:{
                    id:Number(slug)
                },
                data:{
                    name,
                    email,
                    profession,
                    phone,
                    
                   
                }
               })
               return res.status(200).json({message:"Colaborador editado com sucesso!"})
        }
    } catch (error) {
        console.log(error)
       return this?.handleError(error,res) 
    }
    finally{
        return this?.handleDisconnect()
    }
   
    
   
 }
 async deletEmployee(req:Request,res:Response){
  const {id} = req.body
  if(!id){
    return res.status(404).json({message:"Colaborador não encontrado!"})
  }
  try {
    const deletEmployee = await prisma?.employee.delete({
        where:{
            id:Number(id)
        }
      })
      return res.status(200).json({message:"Colaborador deletado com sucesso"})
  } catch (error) {
    console.log(error)
    return this?.handleError(error,res)
  }
  finally{
    return this?.handleDisconnect()
  }
 
 }
}
const EmployeeController = new Employee()
export default EmployeeController