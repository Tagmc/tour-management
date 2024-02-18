import express, { Express, Request, Response } from "express";
//import sequelize from "./config/database";
import dotenv from "dotenv";
import clientRoutes from "./routes/client/index.route";
import moment from "moment";
import bodyParser = require("body-parser");
import { systemConfig } from "./config/system";
import adminRoutes from "./routes/admin/index.route";
dotenv.config();
//sequelize; // vi no chi la 1 bien

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req: Request, res: Response) => {
  res.send("Trang chủ");
}) ;

// App Local Variables
app.locals.moment = moment;

app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes Admin
adminRoutes(app);
//Routes Client
clientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});