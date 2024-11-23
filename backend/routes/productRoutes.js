const express = require('express');
const router = express.Router();
const productAuthMiddleware = require('../middleware/productAuthMiddleware');
const productController = require('../controllers/productController');
const { upload } = require('../utils/cloudinary'); // Ensure this is correct


router.post('/products', upload.single('image'), productController.createProduct);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/:id', productAuthMiddleware(), productController.deleteProduct);

router.get('/products', productAuthMiddleware(true), productController.getProducts);

module.exports = router;
