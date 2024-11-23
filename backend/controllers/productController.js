const Product = require('../models/Product');
const multer = require('multer');
const { storage } = require('../utils/cloudinary'); // Import the Cloudinary storage
const upload = multer({ storage });

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, brand, stocks } = req.body;
    const image = req.file ? req.file.path : null; // Get the Cloudinary URL
    const product = new Product({ name, description, price, brand, image, stocks });
    await product.save();
    res.status(201).json({ message: 'Product created successfully!', product });
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, description, price, brand, stocks } = req.body;
    const image = req.file ? req.file.path : undefined; // Update image only if provided
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

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
};





exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error: error.message });
  }
};



exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('brand', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching products', error: error.message });
  }
};