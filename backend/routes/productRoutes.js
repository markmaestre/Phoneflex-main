// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productAuthMiddleware = require('../middleware/productAuthMiddleware');
const productController = require('../controllers/productController');

// Protected product routes
router.post('/products', productAuthMiddleware(), productController.upload, productController.createProduct);
router.put('/products/:id', productAuthMiddleware(), productController.upload, productController.updateProduct);
router.delete('/products/:id', productAuthMiddleware(), productController.deleteProduct);

// Optional token for viewing products
router.get('/products', productAuthMiddleware(true), productController.getProducts);

module.exports = router;
