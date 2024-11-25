import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ReviewHistory.css';
import ReviewHistoryModal from './ReviewHistoryModal'; 
const ReviewHistory = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  
  useEffect(() => {
    const fetchReviewHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/review/user', {
          headers: { Authorization: `Bearer ${token}` }, 
        });

        if (response.data.length === 0) {
          setError('No reviews found.');
        } else {
          setReviews(response.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch review history', err);
        setError('Failed to load review history');
        setLoading(false);
      }
    };

    fetchReviewHistory();
  }, []);


  const handleEditReview = (review) => {
    setSelectedReview(review); 
  };

  return (
    <div className="review-history">
      <h1>My Review History</h1>
      {loading && <p>Loading reviews...</p>}
      {error && <p>{error}</p>}

      {reviews.length > 0 ? (
        <table className="review-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>{review.productId.name}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>
                  <button onClick={() => handleEditReview(review)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reviews to display.</p>
      )}

      {selectedReview && (
        <ReviewHistoryModal
          reviewId={selectedReview._id}
          rating={selectedReview.rating}
          comment={selectedReview.comment}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
};

export default ReviewHistory;
