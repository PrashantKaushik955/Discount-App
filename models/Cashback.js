const mongoose = require('mongoose');

const cashbackSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
},
  transactionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Transaction',
    required: true
},
  cashbackAmount: { 
    type: Number, 
    required: true 
},
  creditedAt: { type: Date, default: Date.now }, // Timestamp for cashback credit
});

module.exports = mongoose.model('Cashback', cashbackSchema);


