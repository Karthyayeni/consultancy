const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, 
    ref: 'customer', // This must exactly match the name used in `mongoose.model()`
    required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalAmount: Number,
  placedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
