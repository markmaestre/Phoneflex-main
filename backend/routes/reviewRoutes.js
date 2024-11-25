const express = require('express');
const { addReview, getAllReviews, deleteReview } = require('../controllers/ReviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/reviews', authMiddleware, addReview); 
router.get('/reviews', authMiddleware, getAllReviews); 
router.delete('/reviews/:reviewId', authMiddleware, deleteReview);  


module.exports = router;
