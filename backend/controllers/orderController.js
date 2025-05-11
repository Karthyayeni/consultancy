const Order = require('../models/order'); // adjust path if needed

// Mark order as shipped
const markAsShipped = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'Shipped' || order.status === 'Delivered') {
      return res.status(400).json({ message: `Order already ${order.status.toLowerCase()}` });
    }

    order.status = 'Shipped';
    await order.save();

    res.status(200).json({ message: 'Order marked as shipped', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  markAsShipped,
};
