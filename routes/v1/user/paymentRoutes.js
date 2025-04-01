const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const paymentController = require('../../../controllers/v1/user/paymentController');
const { authenticateUser } = require('../../../middleware/authMiddleware');

// Create Payment Session (JWT token required)
router.post('/payment-intent', authenticateUser, paymentController.createPaymentIntent);

// Raw body parsing for Stripe webhook route
router.post('/payment/webhook', bodyParser.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;


