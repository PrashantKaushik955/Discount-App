const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const handleStripeWebhook = require('./controllers/v1/user/paymentController').handleStripeWebhook;

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();

// Middleware Configuration
app.use(cors());

// Critical Webhook Configuration 
app.post(
  '/api/v1/user/payments/payment/webhook',
  bodyParser.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Verify raw body preservation
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).send("Raw body corrupted");
    }
    req.rawBody = req.body; // Attach raw buffer
    next();
  },
  handleStripeWebhook
);

// General body parsers for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (mount after body parsers)
app.use('/api', routes); // This prefixes all routes with /api

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Success and Cancel pages
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.get('/cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cancel.html'));
});

// Fallback Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
});

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("In staging");
});
