const Product = require('../../../models/Product');
const Transaction = require('../../../models/Transaction');
const User = require('../../../models/User');

// Buy Product (Initiating Purchase)
exports.buyProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      console.error('Product not found during buyProduct execution');
      return res.status(404).json({ message: 'Product not found.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found during buyProduct execution');
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log(`Processing purchase for User: ${userId}, Product: ${productId}`);

    const platformCharge = Math.round((product.price * 5) / 100); // Platform charge percentage
    const cashbackAmount = product.cashbackPercentage
      ? Math.round((product.price * product.cashbackPercentage) / 100)
      : 0;

    const transaction = new Transaction({
      userId,
      productId,
      amount: product.price,
      platformCharge,
      cashbackAmount,
      paymentStatus: 'Pending',
    });
    await transaction.save();

    res.status(200).json({
      message: 'Transaction initiated successfully.',
      transactionId: transaction._id,
      productId: product._id,
      platformCharge,
      cashbackAmount,
    });
  } catch (error) {
    console.error('Error during product purchase:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Get User Transactions
exports.getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({ userId }).populate('productId', 'name price');
    if (!transactions.length) {
      return res.status(404).json({ message: 'No transactions found for this user.' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching user transactions:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
