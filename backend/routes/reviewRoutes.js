const express = require('express');
const { addReview, getAllReviews, deleteReview } = require('../controllers/ReviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/reviews', authMiddleware, addReview); // Route to add or update a review
router.get('/reviews', authMiddleware, getAllReviews); // Route to fetch all reviews
router.delete('/reviews/:reviewId', authMiddleware, deleteReview);  // Delete Review by ID


module.exports = router;
