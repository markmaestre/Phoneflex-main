const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const authMiddleware = require('../middleware/authMiddleware'); // Corrected filename
const multer = require('multer');


const upload = multer({ dest: 'uploads/' }); // Ensure this folder exists

router.post('/brands', authMiddleware, upload.single('image'), brandController.createBrand);
router.get('/brands', brandController.getBrands);
router.put('/brands/:id', authMiddleware, upload.single('image'), brandController.updateBrand);
router.delete('/brands/:id', authMiddleware, brandController.deleteBrand);

module.exports = router;
