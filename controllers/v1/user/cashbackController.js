const Cashback = require('../../../models/Cashback');

// Get Cashback History
exports.getCashbackHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch cashback history for the user
    const cashbackHistory = await Cashback.find({ userId })
      .populate('transactionId', 'amount paymentStatus'); // Include paymentStatus for reference

    if (!cashbackHistory.length) {
      return res.status(404).json({ message: 'No cashback records found.' });
    }

    res.status(200).json(cashbackHistory);
  } catch (error) {
    console.error('Error fetching cashback history:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
