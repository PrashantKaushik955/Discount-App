const express = require('express');
const router = express.Router();

const userRoutes = require('./user/userRoutes');
const productRoutes = require('./user/productRoutes');
const cashbackRoutes = require('./user/cashbackRoutes');
const adminRoutes = require('./admin/adminRoutes');
const paymentRoutes = require('./user/paymentRoutes');

router.use('/user', userRoutes); // User authentication and profile routes
router.use('/user/products', productRoutes); // Products should have their own path
router.use('/user/cashback', cashbackRoutes); // Cashback logic
router.use('/user/payments', paymentRoutes); // Payments should have their own path
router.use('/admin', adminRoutes); // Admin panel routes

module.exports = router;
