import { Router, Request, Response } from "express";
import CategoriesController from "../Controllers/Categories";
import ArticleController from "../Controllers/Article";
import MagazineController from "../Controllers/Magazine/index";
import { multerConfig } from "../utils/multerConfig";
import path from "path";
import { chekingToken } from "../Middleware";
import { setTempHashCookie } from "../Middleware/authorizeHash";
import DvlController from "../Controllers/DVL";
//*import GatwayPayment from "../Controllers/MercadoPago";
//import {WebHook,CreateOrder} from "../Controllers/MercadoPago";
import AuthControllers from "../Controllers/Auth";
import UserController from "../Controllers/User";
import {
  calcularPrecoPrazo,
  consultarCep,
  rastrearEncomendas,
} from 'correios-brasil';
import EmployeeController from "../Controllers/Employee";
import PagarmeController from "../Controllers/Pagarme";
import OrdersController from "../Controllers/Orders";
import EventController from "../Controllers/Events";
import BannerController from "../Controllers/Banner";

const route = Router();

//Master
route.post("/user-master", AuthControllers.createAccountUserMaster);
route.post("/signin/userMaster",AuthControllers.authenticationUserMaster)
route.get("/employees",EmployeeController.getAllEmployees)
route.get("/employee/:slug",EmployeeController.getOneEmployee)
route.post("/create-employee",multerConfig.single("profile"),EmployeeController.createEmployee)
route.post("/employee-update/:slug",multerConfig.single("profile"),EmployeeController.editEmployee)
route.delete("/employee-delete",EmployeeController.deletEmployee)
//Master Magaziine
route.get("/edit-magazine/:slug",MagazineController.getOneMagazineEdit)
route.post("/removeEmplooyeMagazine",MagazineController.deleteEmployeeMagazine)
route.post(
  "/update-magazine/:slug",
  multerConfig.fields([
    { name: "new_cover_file", maxCount: 1 },
    { name: "new_pdf_file", maxCount: 1 },
  ]),
  MagazineController.updateMagazine
);
//Master Articles
route.post("/update-article/:slug",multerConfig.fields([
  { name: "new_cover_file", maxCount: 1 },
  { name: "new_pdf_file", maxCount: 1 },
]), ArticleController.updateArticle);
//Master Banners
route.get("/banners", BannerController.getAllBanners)
route.post("/create-banners",multerConfig.single("banner"),BannerController.createBanner)
route.delete("/delet-banners/:slug",BannerController.deletBanner)
//Master Events
route.get("/events",EventController.getAllEvents)
route.get("/covers",EventController.getAllCovers)
route.post("/create-cover-events",multerConfig.single("cover"),EventController.createCoverEvents)
route.post("/create-events",EventController.createEvents)
route.post("/vote-cover-event/:slug",EventController.addVoteCover)
route.delete("/events/delet/:slug",EventController.deletEvent)


route.get("/article-edit/:slug",ArticleController.getOneArticleEdit)
//Categories
route.get("/categories", CategoriesController.getAllCategories);
route.get("/category/:slug", CategoriesController.getOneCategory);
route.post("/category/:slug", CategoriesController.updateCategory);
route.post("/create-category", CategoriesController.createCategory);
route.delete("/delet-category", CategoriesController.deleteCategory);
//Article
route.get("/articles", ArticleController.getAllArticle);
route.get("/articles-free",ArticleController.getArticleFree)
route.get("/articles-most-read",ArticleController.getArticleMostRead)
route.get("/articles-trend",ArticleController.getArticleTrend)
route.get("/articles-recommended",ArticleController.getArticleRecommended)
route.post("/create-article",multerConfig.fields([{ name: "cover_file", maxCount: 1 },{ name: "pdf_file", maxCount: 1 },]),ArticleController.createArticle);
route.post("/update-article/:slug", multerConfig.fields([{ name: "cover_file", maxCount: 1 },{ name: "pdf_file", maxCount: 1 },]),ArticleController.updateArticle);
route.get("/article/:slug", ArticleController.getOneArticle);
route.delete("/delet-article", ArticleController.deleteArticle);
//Magazine
route.get("/magazines", MagazineController.getAllMagazine);
route.get("/magazine/:slug", MagazineController.getOneMagazine);
route.get("/last-magazines", MagazineController.getLastMagazines);
route.post(
  "/create-magazine",
  multerConfig.fields([
    { name: "cover_file", maxCount: 1 },
    { name: "pdf_file", maxCount: 1 },
  ]),
  MagazineController.createMagazine
);
route.post(
  "/update-magazine/:slug",
  multerConfig.fields([
    { name: "cover_file", maxCount: 1 },
    { name: "pdf_file", maxCount: 1 },
  ]),
  MagazineController.updateMagazine
);
route.delete("/delet-magazine", MagazineController.deleteMagazine);

//Auth
route.post("/signUp",AuthControllers.createAccount)
route.post("/signIn",AuthControllers.authentication)

//Users

route.get("/user/:slug",UserController.getOneUser)
route.post("/user-perfil",multerConfig.single("perfil"),UserController.updateUser)
route.post("/user-pass",UserController.changePassUser)
route.get("/library/:slug",UserController.getLibraryUser)

route.get("/library/book/:slug",UserController.getOneBookLibraryUser)

//Payment
route.post("/order",PagarmeController.createOrder)
route.post("/webhook",PagarmeController.webHook)
route.get("/payment-status",PagarmeController.paymentStatus)
//Cep
route.post("/cep", async (req,res)=>{


  try {
    let args = {
      // Não se preocupe com a formatação dos valores de entrada do cep, qualquer uma será válida (ex: 21770-200, 21770 200, 21asa!770@###200 e etc),
      sCepOrigem: '81200100',
      sCepDestino: '21770200',
      nVlPeso: '1',
      nCdFormato: '1',
      nVlComprimento: '20',
      nVlAltura: '20',
      nVlLargura: '20',
      nCdServico: ['04014', '04510'], //Array com os códigos de serviço
      nVlDiametro: '0',
    };
    const getCep =  calcularPrecoPrazo(args).then((response)=>{
      console.log(response)
    }).catch((error)=>console.log(error))
    return res.status(200).json(getCep)
  } catch (error) {
    console.log(error)
  }
  
})
//Orders
route.get("/orders/:slug",OrdersController.getOneOrder)

export default route;
route.post("/read", async (req: Request, res: Response) => {
  const { nameBook } = req.body;

  if (nameBook) {
    const getBook = await prisma?.magazine.findMany({
      where: {
        name: nameBook,
      },
      select: {
        magazine_pdf: true,
      },
    });

    return res.status(200).json(getBook);
  }
});
route.post("/users/:slug",  async (req, res) => {
     const { slug} = req.params
     const { dvl,pay} = req.body
     
      const someValues = dvl.map((items:any)=> Number(items.paidOut) - Number(pay))
      
   try {
    const dvls = await prisma?.dvl.updateMany({
      where:{
        name:slug
      },
      data:{
        toReceive:{
          increment:Number(pay)
        },
        paidOut:{
          decrement:Number(pay)
        }
      }
    })
     console.log(dvls)
     return res.status(200).json(dvls)
   } catch (error) {
     console.log(error)
    return res.status(500).json({message:"Erro"})
   }
   
   
  
   
});
route.get("/user/:slug",  async (req, res) => {
     const { slug} = req.params
   
  try {
    const user = await prisma?.user.findUnique({
      where:{
        id:Number(slug)
      },
      select:{
        name:true,
        orders:true,
        dvlClient:true,
        library:true
        
      },
    
        
      
    })
  

    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
   return res.status(500).json({message:"Erro"})
  }
 
  
});

 route.get("/book",async (req, res) =>{
   const {idUser,idBook} = req.query
    
   const getBookIdUser = await prisma?.library_teste.findFirst({
    where:{
      id:Number(idBook),
      userId:Number(idUser),
     
    },

   })
   return res.status(200).json(getBookIdUser)
   
 })
route.get("/dvl/:slug",  async (req, res) => {
  const { slug} = req.params
try {
 const user = await prisma?.dvl.findMany({
  distinct:["name"],
   where:{
     name:slug
   },})


 return res.status(200).json(user)
} catch (error) {
 console.log(error)
return res.status(500).json({message:"Erro"})
}


});
route.get("/users",  async (req, res) => {
   
  try {
   const dvls = await prisma?.dvl.findMany({
    distinct: ['name'],
      orderBy: {
        name: 'asc', // Ordena por nome para garantir consistência nos resultados
      },
      include:{
        user:true
      }
   })

    return res.status(200).json(dvls)
  } catch (error) {
    console.log(error)
   return res.status(500).json({message:"Erro"})
  }
 
  
});
route.get("/user-dvl",DvlController.getAllCategories)

//payment 
/*route.post("/payment",GatwayPayment)
route.post("/webhook",WebHook)

//Payemnts and Orders

route.post("/order",CreateOrder)

*/
route.get("/teste", async (req: Request, res: Response) => {
  return res.send("funcionando")
});