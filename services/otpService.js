const crypto = require('crypto');
const config = require('../config/config');

exports.generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
};

exports.verifyOTP = (user, otp) => {
  const isOtpValid = user.otp === otp && user.otpExpiry > Date.now();
  return isOtpValid;
};
