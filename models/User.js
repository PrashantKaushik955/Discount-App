const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    unique: true, 
    required: true 
},
  phone: { 
    type: String, 
    required: true 
},
  password: { 
    type: String, 
    required: true 
},
  wallet: { 
    type: Number, 
    default: 0 }, // Cashback balance
  otp: { 
    type: String // OTP for email/phone verification
}, 
  otpExpiry: { 
    type: Date  // OTP expiration
}, 
isAdmin: { 
    type: Boolean, 
    default: false  // Admin flag
 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
