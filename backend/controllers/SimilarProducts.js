// controllers/productController.js
const Product = require('../models/Product');

const getSimilarProducts = async (req, res) => {
  const { id } = req.params;

  try {
    // Get the current product
    const currentProduct = await Product.findById(id);
    if (!currentProduct) return res.status(404).json({ message: 'Product not found' });

    const similarProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: id }
    }).limit(5); // You can change the limit

    res.status(200).json({ similar: similarProducts });
  } catch (error) {
    console.error('Error fetching similar products:', error);
    res.status(500).json({ message: 'Server error fetching similar products' });
  }
};

module.exports = { getSimilarProducts };
