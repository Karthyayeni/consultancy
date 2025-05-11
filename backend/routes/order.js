const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/Product'); // ✅ Import Product model
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables
const User = require('../models/user');
const {
  markAsShipped,
} = require('../controllers/orderController');

router.post('/', async (req, res) => {
  const { userId, items, totalAmount, address } = req.body;

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

    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items,
      totalAmount,
      address,
      paymentMethod: 'Cash on Delivery',
      status: 'Placed',
      orderDate: new Date(),
    });

    await order.save();

    // ✅ Fetch user's email
    const user = await User.findById(userId);
    if (!user || !user.email) {
      return res.status(500).json({ message: 'User email not found to send confirmation' });
    }

    // ✉️ Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // Your 16-char app password
      },
    });

    // 🧾 Format items
    const itemList = items
      .map(item => `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`)
      .join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'RAJAA STORES - Order Confirmation',
      text: `Hi ${user.name},\n\nThank you for placing your order with RAJAA STORES!\n\n📦 Order Summary:\n${itemList}\n\nTotal Amount: ₹${totalAmount}\n\n📍 Delivery Address:\n${address}\n\n🧾 Payment Method: Cash on Delivery\n\nWe’ll process your order shortly.\n\nRegards,\nRAJAA STORES`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Order placed, email sent ✅', order });
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

router.put('/:id/ship', markAsShipped);


router.put('/:id/deliver', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'Delivered';
    await order.save();

    res.json({ message: 'Order marked as Delivered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'Cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
