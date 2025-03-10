import express from "express"
import configViewEngine from "./config/viewEngine"
import bodyParser from "body-parser"
import webRoute from "./route/web"
import connectDB from "./config/connectionDB"
import fileUpload from "express-fileupload"
import path from "path"
require('dotenv').config();

const app = express();

//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

configViewEngine(app)
webRoute(app)
connectDB()

let port = process.env.PORT || 8069
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});