const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

// Create user with image upload
router.post('/create', upload.single('image'), userController.createUser);

// Update user with optional image upload
router.put('/update/:id', upload.single('image'), userController.updateUser);

// Delete user
router.delete('/delete/:id', userController.deleteUser);

// Get user
router.get('/:id', userController.getUser);

module.exports = router; 