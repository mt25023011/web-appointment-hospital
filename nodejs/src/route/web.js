import express from "express"
import homeController from "../controllers/homController"

let router = express.Router()

let webRoute = (app) => {
    router.get("/", homeController.homeController)
    router.get("/about", homeController.aboutController)


    router.get("/crud", homeController.getCRUD)
    router.post("/post-crud", homeController.postCRUD)
    router.get("/get-crud", homeController.displayGetCRUD)
    router.get("/edit-crud", homeController.editCRUD)
    router.post("/put-crud", homeController.putCRUD)
    router.get("/delete-crud", homeController.deleteCRUD)
    
    return app.use("/", router)
}

module.exports=webRoute