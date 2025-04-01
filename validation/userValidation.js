const Joi = require('joi');

// User Registration Validation
const registerValidation = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().min(6).required(),
    isAdmin: Joi.boolean().optional() // Allow "isAdmin" field optionally
  });

// OTP Verification Validation
const otpValidation = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(), // 6-digit OTP
});

// User Login Validation
const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerValidation, otpValidation, loginValidation };
