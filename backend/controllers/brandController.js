const Brand = require('../models/Brand');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file.path; // Use multer to get the image path
    const brand = new Brand({ name, description, image });
    await brand.save();
    res.status(201).json({ message: 'Brand created successfully!', brand });
  } catch (error) {
    res.status(400).json({ message: 'Error creating brand', error: error.message });
  }
};

// Get all brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching brands', error: error.message });
  }
};

// Update a brand
exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : undefined; // Check if an image is uploaded
    const updatedBrand = await Brand.findByIdAndUpdate(id, { name, description, image }, { new: true });
    res.status(200).json({ message: 'Brand updated successfully!', updatedBrand });
  } catch (error) {
    res.status(400).json({ message: 'Error updating brand', error: error.message });
  }
};

// Delete a brand
exports.deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    await Brand.findByIdAndDelete(id);
    res.status(200).json({ message: 'Brand deleted successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting brand', error: error.message });
  }
};
