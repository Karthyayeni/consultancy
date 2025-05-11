const express = require('express');
const router = express.Router();
const { getSimilarProducts } = require('../controllers/productController');

router.get('/similar/:id', getSimilarProducts);

module.exports = router;