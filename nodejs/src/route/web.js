import express from "express"
import homeController from "../controllers/homeController"
import userController from "../controllers/userController"

let router = express.Router()

let webRoute = (app) => {
    router.get("/", homeController.homeController)

    router.get("/crud/show", homeController.displayGetCRUD)    

    router.get("/user/list-user", userController.getlistUser)
    router.get("/user/get-user", userController.getUserById)
    router.post("/user/create-user", userController.createUser)
    router.put("/user/update-user", userController.updateUser)
    router.delete("/user/delete-user", userController.deleteUser)
    
    return app.use("/", router)
}

module.exports=webRoute