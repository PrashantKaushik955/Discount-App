const express = require('express');
const router = express.Router();
const adminController = require('../../../controllers/v1/admin/adminController');
const { authenticateUser, authorizeAdmin } = require('../../../middleware/authMiddleware');

// Admin endpoints
router.post('/products',authenticateUser,authorizeAdmin,adminController.addProduct);       // Add product
router.delete('/products/:productId',authenticateUser,authorizeAdmin,adminController.deleteProduct); // Delete product
router.get('/users',authenticateUser,authorizeAdmin,adminController.getAllUsers);         // Get all users

module.exports = router;
