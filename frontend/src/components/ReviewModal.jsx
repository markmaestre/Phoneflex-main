import React, { useState } from 'react';
import axios from 'axios';
import './css/ReviewModal.css';

const ReviewModal = ({ orderId, productId, onClose }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        { orderId, productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);

      // Close the modal after submission
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="review-modal">
      <div className="review-modal-content">
        <h2>Write a Review</h2>
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ReviewModal;
