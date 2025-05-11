const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.post('/', async (req, res) => {
  const { orderId, userId, message } = req.body;
  
  try {
    // Create a new notification with orderId, userId, and message
    const notification = new Notification({
      userId,
      message,
      orderId, // Ensure you have an orderId if needed
    });

    await notification.save();
    res.status(201).json({ message: 'Notification created successfully' });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.put('/mark-read/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const updatedNotifications = await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Error marking notifications as read' });
  }
});


module.exports = router;
