import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/users";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { options } from "./swaggerOptions";

import Client from "ftp";
/* import { FtpSrv } from "ftp-srv";

const ftpServer = new ftpServer({
    url: 'ftp://192.168.1.2/',

}) */


const c = new Client();

  c.on('ready', function() {


    c.put('logo.png', '/Asignaciones/logo.png', function(err, list){
        if(err) throw err;
        c.end();
    })

    c.list(function(err, list) {
        if (err) throw err;
        console.dir(list);
       // c.end();
      });
  });

c.connect({
    host: "192.168.1.2",
    user: "RV-USUARIO",
    password: "P@ssw0rd"
}); 


const app = express();
const specs = swaggerJSDoc(options);

app.set("port", 3000);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRoutes);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

export default app;
