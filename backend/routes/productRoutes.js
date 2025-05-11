const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { getSimilarProducts } = require('../controllers/SimilarProducts');
router.post('/', upload.single('image'), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);
router.get('/similar/:id', getSimilarProducts);
module.exports = router;
