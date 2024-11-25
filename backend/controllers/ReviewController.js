const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Add a new review or update existing one
const addReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if review already exists for this order and product
    let existingReview = await Review.findOne({ userId, productId, orderId });

    if (existingReview) {
      // If review exists, update it
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.status = 'reviewed'; // Mark as reviewed
      await existingReview.save();

      // Update product rating
      const product = await Product.findById(productId);
      if (product) {
        product.totalRatings += rating - existingReview.rating; // Adjust the total rating
        await product.save();
      }

      // Update order status to 'success' after review
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'success'; // Set the order status to 'success'
        await order.save();
      }

      return res.status(200).json({ message: 'Review updated successfully.', review: existingReview });
    }

    // If no review exists, create a new one
    const newReview = new Review({ userId, productId, orderId, rating, comment });
    await newReview.save();

    // Update product rating
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    product.totalRatings += rating;
    product.ratingCount += 1;
    await product.save();

    // Update order status to 'success' after review
    const order = await Order.findById(orderId);
    if (order) {
      order.status = 'success'; // Set the order status to 'success'
      await order.save();
    }

    res.status(201).json({ message: 'Review added successfully.', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add or update review.' });
  }
};

// Fetch review history for the logged-in user
const getUserReviewHistory = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated user

    // Fetch reviews with status 'reviewed' for the logged-in user
    const reviews = await Review.find({ userId, status: 'reviewed' }).populate('productId', 'name');

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviewed reviews found.' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch review history.' });
  }
};

// Update an existing review
const updateReview = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;

    // Find the review to update
    const review = await Review.findById(reviewId);

    if (!review || review.status !== 'reviewed') {
      return res.status(404).json({ message: 'Review not found or already not reviewed.' });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update product rating
    const product = await Product.findById(review.productId);
    if (product) {
      product.totalRatings += rating - review.rating; // Adjust the total rating
      await product.save();
    }

    res.status(200).json({ message: 'Review updated successfully.', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update review.' });
  }
};

// Fetch all reviews
const getAllReviews = async (req, res) => {
  try {
    // Fetch all reviews and populate user and product data
    const reviews = await Review.find()
      .populate('userId', 'name') // Populating user data, such as name
      .populate('productId', 'name') // Populating product data, such as name
      .populate('orderId', 'status'); // Optionally populate orderId with status or other details

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found.' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch reviews.' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params; // Get the reviewId from the route parameter
    const userId = req.user._id; // Get the user ID from the authenticated user

    // Find the review by ID and ensure it's the logged-in user who is deleting the review
    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or not authorized to delete.' });
    }

    // Find the product associated with the review
    const product = await Product.findById(review.productId);

    // Delete the review from the database
    await review.remove();

    // Adjust the product's total ratings without removing the rating count or product info
    if (product) {
      product.totalRatings -= review.rating; // Subtract the deleted review's rating
      product.ratingCount -= 1; // Decrease the rating count
      await product.save();
    }

    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete review.' });
  }
};

module.exports = { addReview, getUserReviewHistory, updateReview, getAllReviews, deleteReview };
