const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/v1/user/userController');
const { registerValidation, otpValidation, loginValidation } = require('../../../validation/userValidation');
const validate = require('../../../middleware/validationMiddleware');
const { authenticateUser } = require('../../../middleware/authMiddleware');
const transactionController = require('../../../controllers/v1/user/transactionController');



// Routes
router.post('/register', validate(registerValidation), userController.registerUser); // User Registration
router.post('/verify-otp', validate(otpValidation), userController.verifyOTP);       // OTP Verification
router.post('/login', validate(loginValidation), userController.loginUser);         // User Login
router.get('/wallet',authenticateUser,userController.getWalletBalance);            // Get Wallet Balance 
router.post('/resend-otp', userController.resendOTP); // Resend OTP

 
// Get transaction history for a user
router.get('/transactions/:userId', authenticateUser, transactionController.getUserTransactions);

module.exports = router;



