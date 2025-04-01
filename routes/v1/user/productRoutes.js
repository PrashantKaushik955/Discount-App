const express = require('express');
const router = express.Router();
const productController = require('../../../controllers/v1/user/productController');
const transactionController = require('../../../controllers/v1/user/transactionController');
const { authenticateUser } = require('../../../middleware/authMiddleware');

// Fetch all products
router.get('/products',authenticateUser,productController.getAllProducts);

// Buy a product
router.post('/products/buy', authenticateUser, transactionController.buyProduct);


module.exports = router;
