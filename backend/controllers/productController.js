const Product = require('../models/Product');
const multer = require('multer');
const { storage } = require('../utils/cloudinary'); 
const upload = multer({ storage });


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


exports.getMonthlySales = async (req, res) => {
  try {
    const salesData = await Product.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, 
          count: { $sum: 1 } 
        }
      },
      {
        $sort: { _id: 1 } 
      }
    ]);

    
    const monthlySales = Array(12).fill(0); 
    salesData.forEach(({ _id, count }) => {
      monthlySales[_id - 1] = count; 
    });

    res.status(200).json({ monthlySales });
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly sales data", error: error.message });
  }
};