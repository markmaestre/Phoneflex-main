import React, { useState } from 'react';
import axios from 'axios';
import './css/ReviewHistoryModal.css';

const ReviewHistoryModal = ({ reviewId, rating, comment, onClose }) => {
  const [newRating, setNewRating] = useState(rating);
  const [newComment, setNewComment] = useState(comment);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/reviews',
        { reviewId, rating: newRating, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      onClose(); // Close modal after submitting
    } catch (err) {
      console.error(err);
      setError('Failed to update review. Please try again.');
    }
  };

  return (
    <div className="review-history-modal">
      <div className="review-history-modal-content">
        <h2>Update Your Review</h2>
        <label>
          Rating:
          <select value={newRating} onChange={(e) => setNewRating(e.target.value)}>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Update your comment here..."
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ReviewHistoryModal;
