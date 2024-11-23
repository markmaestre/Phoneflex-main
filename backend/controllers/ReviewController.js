const Review = require('../models/Review');
const Product = require('../models/Product');

const addReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.user._id;

    const existingReview = await Review.findOne({ userId, productId, orderId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

   
    const newReview = new Review({ userId, productId, orderId, rating, comment });
    await newReview.save();


    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    product.totalRatings += rating;
    product.ratingCount += 1;
    await product.save();

    res.status(201).json({ message: 'Review added successfully.', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add review.' });
  }
};

module.exports = { addReview };
