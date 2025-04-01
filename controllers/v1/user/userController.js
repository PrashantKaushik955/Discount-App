const User = require('../../../models/User');
const { generateOTP, verifyOTP } = require('../../../services/otpService');
const { sendEmail } = require('../../../services/emailService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');

// User Registration
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, isAdmin } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(`Registration failed. Email ${email} already exists.`);
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate an OTP and its expiry
    const otp = generateOTP();
    const otpExpiry = Date.now() + config.otpExpiry;

    // Create the user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isAdmin: isAdmin || false, // Securely handle admin flag
      otp,
      otpExpiry,
    });

    await newUser.save();

    // Send OTP to user's email
    await sendEmail(email, 'Verify Your Account', `Your OTP is ${otp}. It is valid for 5 minutes.`);

    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
  } catch (error) {
    console.error('Error during user registration:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// OTP Verification
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`Verification failed. No user found for email ${email}.`);
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify the OTP
    if (!verifyOTP(user, otp)) {
      console.error(`Invalid or expired OTP for user ${email}.`);
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Clear the OTP and activate the account
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully.' });
  } catch (error) {
    console.error('Error during OTP verification:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`Login failed. No user found with email ${email}.`);
      return res.status(404).json({ message: 'Invalid email or password.' });
    }

    // Check if OTP is verified
    if (user.otp || user.otpExpiry > Date.now()) {
      console.error(`Login failed. OTP verification required for user ${email}.`);
      return res.status(400).json({ message: 'Please verify your OTP first.' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error(`Login failed. Invalid password for email ${email}.`);
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, config.jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '7d' });

    // Include user details in the response
    res.status(200).json({
      message: 'Login successful.',
      accessToken,
      refreshToken,
      user: {
        id: user._id, // Include the userId
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error during user login:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


// Wallet Balance
exports.getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      console.error(`Wallet balance fetch failed. User ${userId} not found.`);
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ walletBalance: user.wallet || 0 });
  } catch (error) {
    console.error('Error fetching wallet balance:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`Resend OTP failed. No user found with email ${email}.`);
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate new OTP and update expiry
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + config.otpExpiry;
    await user.save();

    // Send OTP via email
    await sendEmail(email, 'Resend OTP', `Your new OTP is ${otp}. It is valid for 5 minutes.`);
    res.status(200).json({ message: 'OTP resent successfully.' });
  } catch (error) {
    console.error('Error resending OTP:', error.message);
    res.status(500).json({ message: 'Failed to resend OTP. Please try again later.' });
  }
};
