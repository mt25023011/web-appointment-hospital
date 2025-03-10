import express from "express"
import homeController from "../controllers/homeController"

let router = express.Router()

let webRoute = (app) => {
    router.get("/", homeController.homeController)


    router.get("/crud/create", homeController.getCRUD)
    router.post("/crud/post-crud", homeController.postCRUD)
    router.get("/crud/show", homeController.displayGetCRUD)
    router.get("/crud/edit-crud", homeController.editCRUD)
    router.post("/crud/put-crud", homeController.putCRUD)
    router.get("/crud/delete-crud", homeController.deleteCRUD)
    
    return app.use("/", router)
}

module.exports=webRoute