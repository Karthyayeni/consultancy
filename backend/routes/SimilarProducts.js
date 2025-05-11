const express = require('express');
const router = express.Router();
const { getSimilarProducts } = require('../controllers/ProductController');

router.get('/similar/:id', getSimilarProducts);

module.exports = router;