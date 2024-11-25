import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/TransactionHistory.css';
import ReviewModal from './ReviewModal'; // Import ReviewModal

const TransactionHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null); // For Review Modal

  // Fetch user's delivered orders (status: 'delivered')
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/orders/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter only orders with 'delivered' status
        const deliveredOrders = response.data.filter(order => order.status === 'delivered');
        setOrders(deliveredOrders);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle review click
  const handleReviewClick = (order) => {
    setReviewOrder(order); // Open review modal
  };

  return (
    <div className="transaction-history">
      <h1>Transaction History</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p>{error}</p>}

      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Status</th>
            <th>Total</th>
            <th>Order Date</th>
            <th>Shipping Address</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.status}</td>
              <td>₱{order.totalPrice.toFixed(2)}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.shippingAddress}</td>
              <td>
                {order.products.map((product, index) => (
                  <div key={index}>
                    {product.name} (x{product.quantity})
                  </div>
                ))}
              </td>
              <td>
                {}
                {order.review?.status !== 'reviewed' && (
                  <button
                    onClick={() => handleReviewClick(order)}
                    className="action-button review-button"
                  >
                    Review & Ratings
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {}
      {reviewOrder && (
        <ReviewModal
          orderId={reviewOrder._id}
          productId={reviewOrder.products[0].productId} 
          onClose={() => setReviewOrder(null)}
        />
      )}
    </div>
  );
};

export default TransactionHistory;
