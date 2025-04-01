require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  otpExpiry: 5 * 60 * 1000,
  platformChargePercentage: 5,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  CLIENT_URL: process.env.CLIENT_URL, // Corrected variable name
  emailConfig: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
};
