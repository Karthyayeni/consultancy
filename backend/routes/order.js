const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/Product'); // ✅ Import Product model
const mongoose = require('mongoose');

// 🧾 Place order - Cash on Delivery only
router.post('/', async (req, res) => {
  const { userId, items, totalAmount } = req.body;

  try {
    for (const item of items) {
      const product = await Product.findOne({ name: item.name });

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    // ✅ Save order
    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items,
      totalAmount,
      paymentMethod: 'Cash on Delivery',
      status: 'Placed',
      orderDate: new Date(),
    });

    await order.save();

    res.status(201).json({ message: 'Order placed successfully and stock updated ✅', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// 🔁 Get all orders (admin)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name address');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// 🙋‍♂️ Get user orders
router.get('/myorders', async (req, res) => {
  const userId = req.query.userId;

  try {
    const orders = await Order.find({ userId })
      .populate('userId', 'name')
      .exec();

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;
