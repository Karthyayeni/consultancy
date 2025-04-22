const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart for a user with product details
router.post('/add', async (req, res) => {
    const { userId, item } = req.body;
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        // Create a new cart
        cart = new Cart({ userId, items: [item] });
      } else {
        // Check if item already exists
        const existingItem = cart.items.find(
          (i) => i.name === item.name
        );
  
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          cart.items.push(item);
        }
      }
  
      await cart.save();
      res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Failed to add to cart' });
    }
  });

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.name');
    if (!cart) return res.json({ items: [] }); // Return empty if no cart
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

router.put('/update/:userId', async (req, res) => {
  const { userId } = req.params;
  const { itemName, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemToUpdate = cart.items.find(item => item.name === itemName);

    if (!itemToUpdate)
      return res.status(404).json({ message: 'Item not found in cart' });

    itemToUpdate.quantity = quantity;

    await cart.save();
    res.json({ message: 'Quantity updated successfully', cart });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE an item from the cart
router.delete('/remove/:userId', async (req, res) => {
  const { userId } = req.params;
  const { itemName } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.name !== itemName);
    await cart.save();

    res.json({ message: 'Item removed from cart successfully', cart });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Clear user's cart after order is placed
router.delete('/clear/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.json({ message: 'Cart cleared after order placement.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
});



module.exports = router;
