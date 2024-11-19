import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckoutModal from './CheckoutModal'; // Import CheckoutModal
import ReviewModal from './ReviewModal'; // Import ReviewModal
import './css/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // For Checkout Modal
  const [confirmDelete, setConfirmDelete] = useState(null); // For Delete Confirmation Modal
  const [reviewOrder, setReviewOrder] = useState(null); // For Review Modal

  // Fetch user's order history
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/orders/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setError('Failed to load orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle order deletion
  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter(order => order._id !== orderId));
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting order', error);
      alert('Failed to delete order');
    }
  };

  const handleDeleteConfirmation = (orderId) => {
    setConfirmDelete(orderId); // Show delete confirmation
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null); // Cancel delete
  };

  const handleStatusUpdated = (updatedOrder) => {
    setOrders(orders.map((order) =>
      order._id === updatedOrder._id ? updatedOrder : order
    ));
  };

  const handleReviewClick = (order) => {
    setReviewOrder(order); // Open review modal
  };

  const handleBackClick = () => {
    window.location.href = '/user-dashboard';
  };

  return (
    <div className="order-history">
      <button onClick={handleBackClick} className="back-button">Back to Dashboard</button>
      <h1>Order History</h1>
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
            <th>Quantity</th>
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
                  <div key={index}>{product.name} (x{product.quantity})</div>
                ))}
              </td>
              <td>
                {order.status === 'pending' && (
                  <>
                    <button onClick={() => setSelectedOrder(order)} className="action-button">Checkout</button>
                    <button onClick={() => handleDeleteConfirmation(order._id)} className="action-button delete-button">Delete</button>
                  </>
                )}

                {order.status === 'cancelled' && (
                  <p>Order Cancelled</p>
                )}

                {order.status === 'delivered' && (
                  <button onClick={() => handleReviewClick(order)} className="action-button review-button">Review & Ratings</button>
                )}

                {order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'pending' && (
                  <button onClick={() => setSelectedOrder(order)} className="action-button">View Details</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Checkout Modal */}
      {selectedOrder && (
        <CheckoutModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <ReviewModal
          orderId={reviewOrder._id}
          productId={reviewOrder.products[0].productId} // Pass the correct product ID
          onClose={() => setReviewOrder(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="delete-confirmation">
          <p>Are you sure you want to cancel this order?</p>
          <button onClick={() => handleDeleteOrder(confirmDelete)} className="action-button">Yes</button>
          <button onClick={handleCancelDelete} className="action-button">No</button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
