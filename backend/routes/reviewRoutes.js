const express = require('express');
const { addReview } = require('../controllers/ReviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST route for adding reviews
router.post('/reviews', authMiddleware, addReview);

module.exports = router;
