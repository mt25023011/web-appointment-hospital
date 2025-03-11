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
        let data = req.body;
        
        // Handle optional image upload
        if (req.files && req.files.image) {
            const fs = require('fs');
            const path = require('path');
            let image = req.files.image;
            
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(image.mimetype)) {
                throw new Error('Invalid file type. Only JPEG, PNG and GIF images are allowed.');
            }
            
            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (image.size > maxSize) {
                throw new Error('File size too large. Maximum size is 5MB.');
            }

            // Get file extension and sanitize base name
            const fileExtension = path.extname(image.name);
            const baseName = path.basename(image.name, fileExtension);
            const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');

            // Generate unique filename
            const generateUniqueFileName = () => {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 10000);
                return `${sanitizedBaseName}_${timestamp}_${random}${fileExtension}`;
            };

            // Setup upload directory
            const uploadDir = path.join(__dirname, '../public/uploads/users');
            
            // Create directories if they don't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Generate unique filename (try up to 10 times)
            let newFileName;
            let uploadPath;
            let maxAttempts = 10;
            let attempt = 0;

            do {
                attempt++;
                newFileName = generateUniqueFileName();
                uploadPath = path.join(uploadDir, newFileName);
                if (attempt >= maxAttempts) {
                    throw new Error('Failed to generate unique filename after multiple attempts');
                }
            } while (fs.existsSync(uploadPath));
            
            // Move file to uploads directory
            await image.mv(uploadPath);
            
            // Add image path to data
            data.image = `/uploads/users/${newFileName}`;
        }

        await CRUDservice.createNewUser(data);
        return res.redirect('/crud/show?message=User created successfully');
    } catch (error) {
        console.error('Error in postCRUD:', error);
        return res.redirect(`/crud?error=${encodeURIComponent(error.message)}`);
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
        let data = req.body;
        const fs = require('fs');
        const path = require('path');

        // Get current user data to check for existing image
        const currentUser = await db.User.findOne({
            where: { id: data.id },
            raw: true
        });

        if (!currentUser) {
            return res.redirect('/crud/show?error=User not found');
        }

        // Handle image upload if new image is provided
        if (req.files && req.files.image) {
            let image = req.files.image;
            
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(image.mimetype)) {
                throw new Error('Invalid file type. Only JPEG, PNG and GIF images are allowed.');
            }
            
            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (image.size > maxSize) {
                throw new Error('File size too large. Maximum size is 5MB.');
            }

            // Get file extension and sanitize base name
            const fileExtension = path.extname(image.name);
            const baseName = path.basename(image.name, fileExtension);
            const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');

            // Generate unique filename
            const generateUniqueFileName = () => {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 10000);
                return `${sanitizedBaseName}_${timestamp}_${random}${fileExtension}`;
            };

            // Setup upload directory
            const uploadDir = path.join(__dirname, '../public/uploads/users');
            
            // Create directories if they don't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Generate unique filename (try up to 10 times)
            let newFileName;
            let uploadPath;
            let maxAttempts = 10;
            let attempt = 0;

            do {
                attempt++;
                newFileName = generateUniqueFileName();
                uploadPath = path.join(uploadDir, newFileName);
                if (attempt >= maxAttempts) {
                    throw new Error('Failed to generate unique filename after multiple attempts');
                }
            } while (fs.existsSync(uploadPath));
            
            // Delete old image if exists
            if (currentUser.image) {
                const oldImagePath = path.join(__dirname, '../public', currentUser.image.startsWith('/') ? currentUser.image.slice(1) : currentUser.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Move new file to uploads directory
            await image.mv(uploadPath);
            
            // Add new image path to data
            data.image = `/uploads/users/${newFileName}`;
        }

        // Update user data
        await CRUDservice.updateUser(data);
        return res.redirect('/crud/show?message=User updated successfully');
    } catch (error) {
        console.error('Error in putCRUD:', error);
        return res.redirect(`/crud/show?error=Failed to update user: ${error.message}`);
    }
}

let deleteCRUD = async (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        let id = req.query.id;
        
        if (!id) {
            return res.redirect('/crud/show?error=User ID is required for deletion');
        }

        // Get user data before deletion to access image path
        const user = await db.User.findOne({
            where: { id: id },
            raw: true
        });

        if (!user) {
            return res.redirect('/crud/show?error=User not found');
        }

        // Delete the user's image if it exists
        if (user.image) {
            try {
                // Fix: Remove the leading slash from user.image and use correct path
                const imagePathFromDB = user.image.startsWith('/') ? user.image.slice(1) : user.image;
                const imagePath = path.join(__dirname, '../public', imagePathFromDB);
                console.log('Attempting to delete image at:', imagePath);
                
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log('Image deleted successfully');
                } else {
                    console.log('Image file not found at:', imagePath);
                }
            } catch (imageError) {
                console.error('Error deleting image file:', imageError);
                // Continue with user deletion even if image deletion fails
            }
        }

        // Delete user from database
        await CRUDservice.deleteUser(id);
        return res.redirect('/crud/show?message=User and associated image deleted successfully');
    } catch (error) {
        console.error('Error in deleteCRUD:', error);
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
    deleteCRUD: deleteCRUD,
}
