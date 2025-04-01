const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  amount: { type: Number, required: true },
  platformCharge: { type: Number, default: 20 },
  cashbackAmount: { type: Number },
  paymentStatus: { type: String, enum: ['Success', 'Pending', 'Failed'], default: 'Pending' },
  paymentIntentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
