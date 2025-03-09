import express from "express"
import configViewEngine from "./config/viewEngine"
import bodyParser from "body-parser"
import webRoute from "./route/web"
import connectDB from "./config/connectionDB"
require('dotenv').config();

const app = express();

//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configViewEngine(app)
webRoute(app)
connectDB()

let port = process.env.PORT || 8069
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});