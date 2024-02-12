import express ,{Request,Response, application} from  "express"
import cors from "cors"
import bodyParser from "body-parser"
const path = require('path');
const cookieParser = require('cookie-parser')
import Route from "./routes/index"
require('dotenv').config()
const app = express()
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(Route)


 app.listen(5000,()=>{
    console.log("Servidor rodando na porta http://localhost:5000")
 })