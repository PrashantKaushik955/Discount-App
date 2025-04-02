const stripe = require('stripe')(require('../../../config/config').stripeSecretKey);
const Product = require('../../../models/Product');
const User = require('../../../models/User');
const Transaction = require('../../../models/Transaction');
const { stripeWebhookSecret } = require('../../../config/config');

// Create Payment Intent (unchanged)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { productId, userId } = req.body;


    // Validate User ID
    if (!userId || userId === "undefined") {
      console.error('Error: User ID is required.');
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Validate Product
    const product = await Product.findById(productId);
    if (!product) {
      console.error(`Error: Product not found for ID: ${productId}`);
      return res.status(404).json({ message: 'Product not found.' });
    }

    const amount = product.price * 100;
    console.log(`Product found: ${product.name}, Amount (in cents): ${amount}`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: { productId, userId },
      description: `Payment for product ${productId} by user ${userId}`,
    });

    console.log('Payment Intent created successfully:', paymentIntent.id);

    const platformCharge = (product.price * 0.05);
    const transaction = new Transaction({
      userId,
      productId,
      amount: product.price,
      platformCharge,
      paymentStatus: 'Pending',
      paymentIntentId: paymentIntent.id,
      cashbackAmount: product.cashbackPercentage ? Math.round((product.price * product.cashbackPercentage) / 100):0,
    });
    await transaction.save();

    console.log('Transaction saved successfully:', transaction._id);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: 'Payment intent created successfully.',
    });
  } catch (error) {
    console.error('Error creating Payment Intent:', error.message);
    res.status(500).json({ message: 'Failed to create Payment Intent. Please try again later.' });
  }
};

// Stripe Webhook Handler -> 
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    // 1. Verify raw body preservation
    if (!req.rawBody || !Buffer.isBuffer(req.rawBody)) {
      throw new Error("Raw body not preserved correctly");
    }

    // 2. Debug: Compare raw body with Stripe's version
    const payload = req.rawBody.toString('utf8');
    console.log('Received payload:\n', payload);

  
    // Verify the event using the raw body
    const event = stripe.webhooks.constructEvent(
      req.rawBody, // Must use the raw body
      sig,
      stripeWebhookSecret
    );

    console.log(`Stripe Event Verified Successfully: ${event.type}`);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { productId, userId } = paymentIntent.metadata;

      console.log('Payment Intent Succeeded:', paymentIntent.id);
      console.log('Metadata:', { productId, userId });

      const transaction = await Transaction.findOne({ paymentIntentId: paymentIntent.id });
      if (!transaction) {
        console.error('Transaction not found for PaymentIntent ID:', paymentIntent.id);
        return res.status(404).json({ message: 'Transaction not found.' });
      }

      transaction.paymentStatus = 'Success';
      await transaction.save();
      console.log('Transaction updated to Success:', transaction._id);

      const user = await User.findById(userId);
      if (user) {
        user.wallet += transaction.cashbackAmount || 0;
        await user.save();
        console.log(`Wallet updated for User ID ${user._id}. New balance: ₹${user.wallet}`);
      } else {
        console.error(`User not found for ID: ${userId}`);
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.log('Payment Intent Failed:', paymentIntent.id);

      const transaction = await Transaction.findOne({ paymentIntentId: paymentIntent.id });
      if (!transaction) {
        console.error('Transaction not found for Payment Intent ID:', paymentIntent.id);
        return res.status(404).json({ message: 'Transaction not found.' });
      }

      transaction.paymentStatus = 'Failed';
      await transaction.save();
      console.log('Transaction updated to Failed:', transaction._id);
    }

    res.status(200).send('Webhook received and processed successfully.');
  } catch (error) {
    console.error('Error Verifying Webhook:', error.message);
    res.status(400).send(`Webhook verification failed: ${error.message}`);
  }
};

