import express from "express"
import db from "../models/index"
import bodyParser from "body-parser"
import CRUDservice from "../services/CRUDservice"


let homeController = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render("homepage", {
            data: data,
            data2: JSON.stringify(data),
            message: req.query.message
        })
    } catch (error) {
        console.log(error)
        return res.render("homepage", {
            data: [],
            data2: "[]",
            error: "Error loading users: " + error.message
        })
    }
}

let getCRUD = (req, res) => {
    return res.render("crud", {
        message: req.query.message,
        error: req.query.error
    })
}

let postCRUD = async (req, res) => {
    try {
        await CRUDservice.createNewUser(req.body);
        return res.redirect('/get-crud?message=User created successfully');
    } catch (error) {
        console.log(error);
        return res.redirect(`/get-crud?error=Failed to create user: ${error.message}`);
    }
}

let displayGetCRUD = async (req, res) => {
    try {
        let data = await CRUDservice.getAllUser()
        return res.render("displayCRUD", {
            data: data,
            message: req.query.message,
            error: req.query.error
        })
    } catch (error) {
        return res.render("displayCRUD", {
            data: [],
            error: "Failed to fetch users: " + error.message
        })
    }
}

let editCRUD = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.redirect('/get-crud?error=User ID is required');
        }
        
        let userData = await CRUDservice.getUserById(id);
        if (!userData) {
            return res.redirect('/get-crud?error=User not found');
        }

        return res.render("editCRUD", {
            data: userData,
            message: req.query.message,
            error: req.query.error
        });
    } catch (error) {
        console.log('Error:', error);
        return res.redirect(`/get-crud?error=Error editing user: ${error.message}`);
    }
}

let putCRUD = async (req, res) => {
    try {
        await CRUDservice.updateUser(req.body);
        return res.redirect('/get-crud?message=User updated successfully');
    } catch (error) {
        return res.redirect(`/get-crud?error=Failed to update user: ${error.message}`);
    }
}

let deleteCRUD = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.redirect('/get-crud?error=User ID is required for deletion');
        }
        await CRUDservice.deleteUser(id);
        return res.redirect('/get-crud?message=User deleted successfully');
    } catch (error) {
        return res.redirect(`/get-crud?error=Failed to delete user: ${error.message}`);
    }
}

let aboutController = (req, res) => {
    return res.render("about", {
        message: req.query.message,
        error: req.query.error
    })
}

module.exports = {
    homeController: homeController,
    aboutController: aboutController,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    editCRUD: editCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}
