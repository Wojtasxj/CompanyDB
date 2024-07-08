const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

router.get('/products', productsController.getAllProducts);
router.get('/products/random', productsController.getRandomProduct);
router.get('/products/:id', productsController.getProductById);
router.post('/products', productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

module.exports = router;