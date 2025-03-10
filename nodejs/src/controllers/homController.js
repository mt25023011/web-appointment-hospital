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
    return res.render("crud/createCRUD", {
        message: req.query.message,
        error: req.query.error
    })
}

let postCRUD = async (req, res) => {
    try {
        await CRUDservice.createNewUser(req.body);
        return res.redirect('/crud/show?message=User created successfully');
    } catch (error) {
        console.log(error);
        return res.redirect(`/crud/show?error=Failed to create user: ${error.message}`);
    }
}

let displayGetCRUD = async (req, res) => {
    try {
        let data = await CRUDservice.getAllUser()
        return res.render("crud/displayCRUD", {
            data: data,
            message: req.query.message,
            error: req.query.error
        })
    } catch (error) {
        return res.render("crud/displayCRUD", {
            data: [],
            error: "Failed to fetch users: " + error.message
        })
    }
}

let editCRUD = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.redirect('/crud/show?error=User ID is required');
        }
        
        let userData = await CRUDservice.getUserById(id);
        if (!userData) {
            return res.redirect('/crud/show?error=User not found');
        }

        return res.render("crud/editCRUD", {
            data: userData,
            message: req.query.message,
            error: req.query.error
        });
    } catch (error) {
        console.log('Error:', error);
        return res.redirect(`/crud/show?error=Error editing user: ${error.message}`);
    }
}

let putCRUD = async (req, res) => {
    try {
        await CRUDservice.updateUser(req.body);
        return res.redirect('/crud/show?message=User updated successfully');
    } catch (error) {
        return res.redirect(`/crud/show?error=Failed to update user: ${error.message}`);
    }
}

let deleteCRUD = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.redirect('/crud/show?error=User ID is required for deletion');
        }
        await CRUDservice.deleteUser(id);
        return res.redirect('/crud/show?message=User deleted successfully');
    } catch (error) {
        return res.redirect(`/crud/show?error=Failed to delete user: ${error.message}`);
    }
}


module.exports = {
    homeController: homeController,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    editCRUD: editCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}
