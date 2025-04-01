const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
const config = require('../config/config');

// Middleware to Authenticate User
exports.authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    console.error('Authentication failed. No token provided.');
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  try {
      // Log the token for debugging
      console.log('Received token:', token);
    // Verify and decode token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Fetch user details from the database and attach to request
    const user = await User.findById(decoded.id);
    if (!user) {
      console.error(`Authentication failed. User with ID ${decoded.id} not found.`);
      return res.status(404).json({ message: 'User not found. Access denied.' });
    }

    req.user = user; // Attach user object to the request
    next(); // Proceed to the next middleware
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Authentication failed. Token has expired.');
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    } else {
      console.error('Authentication failed. Error verifying token:', error.message);
      return res.status(401).json({ message: 'Invalid token. Access denied.' });
    }
  }
};

// Middleware to Authorize Admin
exports.authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    console.error('Authorization failed. User not authenticated.');
    return res.status(401).json({ message: 'User not authenticated. Access denied.' });
  }

  if (!req.user.isAdmin) {
    console.error(`Authorization failed. User ${req.user._id} does not have admin privileges.`);
    return res.status(403).json({ message: 'Access denied. Admin privileges are required.' });
  }

  next(); // Proceed to the next middleware if the user is an admin
};
