const Product = require('../models/Product');

// Create a product with image
const createProduct = async (req, res) => {
    try {
        const { name, category, price, stock, description } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

        const newProduct = new Product({
            name,
            category,
            price,
            stock,
            description,
            image : imagePath
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a product (including image if uploaded)
const updateProduct = async (req, res) => {
    try {
      const { name, category, price, stock, description } = req.body;
      const image = req.file ? req.file.filename : null;
      console.log(image);
      const existingProduct = await Product.findById(req.params.id);
  
      const updatedData = {
        name,
        category,
        price,
        stock,
        description,
        image: image || existingProduct.image // Keep old image if no new one
      };
  
      const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
