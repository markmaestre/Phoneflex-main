// controllers/productController.js
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

exports.upload = upload.single('image');

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, brand, stocks } = req.body;
    const image = req.file ? req.file.path : null;
    const product = new Product({ name, description, price, brand, image, stocks });
    await product.save();
    res.status(201).json({ message: 'Product created successfully!', product });
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('brand', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching products', error: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, description, price, brand, stocks } = req.body;
    const image = req.file ? req.file.path : undefined;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, brand, image, stocks },
      { new: true }
    );
    res.status(200).json({ message: 'Product updated successfully!', updatedProduct });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error: error.message });
  }
};


// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('brand', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching products', error: error.message });
  }
};
