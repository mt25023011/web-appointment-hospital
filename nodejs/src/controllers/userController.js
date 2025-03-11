const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
import { name } from "ejs";
import db, { sequelize } from "../models/index"

const handleUserImage = async (userId, imageFile, oldImagePath = null) => {
    try {
        // If there's an old image, delete it
        if (oldImagePath) {
            const fullPath = path.join(__dirname, '../public', oldImagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
        
        // Return the relative path of the new image
        return `/uploads/users/${imageFile.filename}`;
    } catch (error) {
        console.error('Error handling user image:', error);
        throw error;
    }
};

let getlistUser = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ error: "Error fetching users: " + error.message })
    }
}
let getUserById = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(400).json({ error: "User ID is required" })
        }
        let data = await db.User.findOne({
            where: {
                id: req.query.id
            }
        })
        if (data===null) {
            return res.status(404).json({ error: "User not found" })
        }
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ error: "Error fetching user: " + error.message })
    }
}

let createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, address, image } = req.body;
        if(!image) {
            const defaultImage = "default-avatar.jpg";
            let data = await db.User.create({   
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                phoneNumber: phoneNumber,
                address: address,
                image: defaultImage
            })
            return res.status(200).json(data)
        }

        let data = await db.User.create({   
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            address: address,
            image: image
        })
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ error: "Error creating user: " + error.message })
    }
}

let updateUser = async (req, res) => {
    try {
        const { id, firstName, lastName, email, password, phoneNumber, address, image } = req.body;
        let user = await db.User.findOne({
            where: {
                id: id
            }
        });
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create update object with only provided fields
        const updateData = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (email !== undefined) updateData.email = email;
        if (password !== undefined) updateData.password = password;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (address !== undefined) updateData.address = address;
        if (image !== undefined) updateData.image = image;
        let data = await db.User.update(updateData, {
            where: { id: id }
        });
        
        // Fetch and return updated user data
        const updatedUser = await db.User.findOne({
            where: { id: id }
        });
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ error: "Error updating user: " + error.message });
    }
}

let deleteUser = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        let user = await db.User.findOne({
            where: { id: id }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await db.User.destroy({
            where: { id: id }
        });

        return res.status(200).json({ 
            message: "User deleted successfully",
            deletedUserId: id 
        });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting user: " + error.message });
    }
}

module.exports = {
    getlistUser: getlistUser,
    getUserById: getUserById,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser
} 