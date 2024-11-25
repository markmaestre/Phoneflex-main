import React, { useEffect, useState } from 'react';

const AllReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            },
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete review');
          }

   
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>All Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review._id}>
              <h3>Product: {review.productId?.name || 'No Product Name'}</h3>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
              <p>Reviewed by: {review.userId?.name || 'Unknown User'}</p>
              <button onClick={() => handleDelete(review._id)}>Delete</button> {/* Delete Button */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllReview;
