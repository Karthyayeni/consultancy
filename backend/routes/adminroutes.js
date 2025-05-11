// adminRoutes.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const Order = require('../models/order');

router.get('/notifications/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.put('/update-order-status/:orderId', async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    console.log("Order Data:", order);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const notification = new Notification({
      userId: order.userId,
      message: `Your order has been ${status.toLowerCase()}.`
    });
    await notification.save();

    res.status(200).json({ message: 'Order updated and notification sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
