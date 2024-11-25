const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { upload } = require('../utils/cloudinary'); 
const authMiddleware = require('../middleware/authMiddleware');

router.post('/brands', upload.single('image'), brandController.createBrand);
router.get('/brands', brandController.getBrands);
router.put('/brands/:id', upload.single('image'), brandController.updateBrand);
router.delete('/brands/:id', authMiddleware, brandController.deleteBrand);

module.exports = router;
