const express = require('express');
const router = express.Router();
const Review = require('../models/Reviews');
const User = require('../models/user'); 
const Product = require('../models/Product');
router.post('/', async (req, res) => {
  const { productId, userId, rating, comment } = req.body;
  

  if (!productId || !userId || !rating) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newReview = new Review({ productId, userId, rating, comment });
    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ message: 'Server error submitting review' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Populate userId to get username from User collection
    const reviews = await Review.find({ productId: req.params.id })
      .populate('userId', 'name') // Populates only the username field
      .sort({ createdAt: -1 })
      .lean();

    // Optional: Rename userId to username for frontend convenience
    const reviewsWithUsername = reviews.map(rev => ({
      ...rev,
      username: rev.userId.username
    }));

    res.json({ ...product.toObject(), reviews: reviewsWithUsername });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});


module.exports = router;
