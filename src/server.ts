import https from "https"
import express ,{Request,Response, application} from  "express"
import cors from "cors"
import fs from  "fs"
import bodyParser from "body-parser"
const path = require('path');
const cookieParser = require('cookie-parser')
import Route from "./routes/index"
require('dotenv').config()
const app = express()

const options = {
   key: fs.readFileSync('key.pem'),
   cert: fs.readFileSync('cert.pem')
 };
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors(

));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(Route)

https.createServer(options, app).listen(5000, () => {
   console.log('Servidor HTTPS está rodando na porta 5000');
 });
app.listen(443,()=>{
  console.log('Servidor HTTP está rodando na porta 443');
})