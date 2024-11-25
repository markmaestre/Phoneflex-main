const Brand = require('../models/Brand');
const multer = require('multer');
const { storage } = require('../utils/cloudinary'); // Cloudinary storage
const upload = multer({ storage });

exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : null; // Get Cloudinary URL
    const brand = new Brand({ name, description, image });
    await brand.save();
    res.status(201).json({ message: 'Brand created successfully!', brand });
  } catch (error) {
    res.status(400).json({ message: 'Error creating brand', error: error.message });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching brands', error: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : undefined; // Only update if new image provided
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, description, image },
      { new: true }
    );
    res.status(200).json({ message: 'Brand updated successfully!', updatedBrand });
  } catch (error) {
    res.status(400).json({ message: 'Error updating brand', error: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    await Brand.findByIdAndDelete(id);
    res.status(200).json({ message: 'Brand deleted successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting brand', error: error.message });
  }
};
