const db = require('../models');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

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

const userController = {
    createUser: async (req, res) => {
        try {
            const { firstName, lastName, email, password, phoneNumber, gender, address, roleID, positionID } = req.body;
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Handle image upload
            const imagePath = req.file ? await handleUserImage(null, req.file) : null;
            
            // Create user
            const newUser = await db.User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phoneNumber,
                gender,
                image: imagePath,
                address,
                roleID,
                positionID
            });
            
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    id: newUser.id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    image: newUser.image
                }
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating user',
                error: error.message
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const updateData = { ...req.body };
            
            // Get current user
            const user = await db.User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Handle password update
            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }

            // Handle image update
            if (req.file) {
                updateData.image = await handleUserImage(userId, req.file, user.image);
            }

            // Update user
            await user.update(updateData);

            res.json({
                success: true,
                message: 'User updated successfully',
                data: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    image: user.image
                }
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating user',
                error: error.message
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            
            // Get user
            const user = await db.User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Delete user's image if exists
            if (user.image) {
                await handleUserImage(userId, null, user.image);
            }

            // Delete user
            await user.destroy();

            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting user',
                error: error.message
            });
        }
    },

    getUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await db.User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching user',
                error: error.message
            });
        }
    }
};

module.exports = userController; 