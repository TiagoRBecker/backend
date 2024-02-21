import { Request, Response, response } from "express";
class Pagarme {
    
async createOrder(req:Request,res:Response){
    console.log(req.body)
}
}

const PagarmeController = new Pagarme()
export default PagarmeController