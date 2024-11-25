const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

const addReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.user._id;

    let existingReview = await Review.findOne({ userId, productId, orderId });

    if (existingReview) {
  
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.status = 'reviewed'; 
      await existingReview.save();

     
      const product = await Product.findById(productId);
      if (product) {
        product.totalRatings += rating - existingReview.rating; 
        await product.save();
      }

      
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'success'; 
        await order.save();
      }

      return res.status(200).json({ message: 'Review updated successfully.', review: existingReview });
    }

    
    const newReview = new Review({ userId, productId, orderId, rating, comment });
    await newReview.save();

  
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    product.totalRatings += rating;
    product.ratingCount += 1;
    await product.save();

  
    const order = await Order.findById(orderId);
    if (order) {
      order.status = 'success'; 
      await order.save();
    }

    res.status(201).json({ message: 'Review added successfully.', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add or update review.' });
  }
};


const getUserReviewHistory = async (req, res) => {
  try {
    const userId = req.user._id; 

    
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


const updateReview = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;

   
    const review = await Review.findById(reviewId);

    if (!review || review.status !== 'reviewed') {
      return res.status(404).json({ message: 'Review not found or already not reviewed.' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

   
    const product = await Product.findById(review.productId);
    if (product) {
      product.totalRatings += rating - review.rating; 
      await product.save();
    }

    res.status(200).json({ message: 'Review updated successfully.', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update review.' });
  }
};


const getAllReviews = async (req, res) => {
  try {
    
    const reviews = await Review.find()
      .populate('userId', 'name') 
      .populate('productId', 'name') 
      .populate('orderId', 'status'); 

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
    const { reviewId } = req.params; 
    const userId = req.user._id; 

   
    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or not authorized to delete.' });
    }

    
    const product = await Product.findById(review.productId);

    
    await review.remove();

    
    if (product) {
      product.totalRatings -= review.rating; 
      product.ratingCount -= 1; 
      await product.save();
    }

    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete review.' });
  }
};

module.exports = { addReview, getUserReviewHistory, updateReview, getAllReviews, deleteReview };
