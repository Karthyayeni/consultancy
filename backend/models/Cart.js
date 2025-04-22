const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      name: String,
      price: Number,
      category: String,
      image: String,
      stock: Number,
      quantity: { type: Number, default: 1 }
    }
  ]
});

module.exports = mongoose.model('usercart', cartSchema);
