import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckoutModal from './CheckoutModal'; // Import CheckoutModal
import ReviewModal from './ReviewModal'; // Import ReviewModal
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
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

        // Filter out orders with status 'delivered'
        const filteredOrders = response.data.filter(order => order.status !== 'delivered');
        setOrders(filteredOrders);
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

  const handleReviewClick = (order) => {
    setReviewOrder(order); // Open review modal
  };

  const handleStatusUpdated = (updatedOrder) => {
    setOrders(orders.map((order) =>
      order._id === updatedOrder._id ? updatedOrder : order
    ));
  };

  const handleBackClick = () => {
    window.location.href = '/user-dashboard';
  };

  return (
    <div className="order-history">
      <Button variant="contained" onClick={handleBackClick} sx={{ mb: 2 }}>Back to Dashboard</Button>
      <h1>Order History</h1>
      {loading && <CircularProgress />}
      {error && <p>{error}</p>}

      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Shipping Address</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>₱{order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>{order.shippingAddress}</TableCell>
                <TableCell>
                  {order.products.map((product, index) => (
                    <div key={index}>
                      {product.name} (x{product.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {order.status === 'pending' && (
                    <>
                      <Button variant="contained" color="primary" onClick={() => setSelectedOrder(order)} sx={{ mr: 1 }}>Checkout</Button>
                      <Button variant="contained" color="error" onClick={() => handleDeleteConfirmation(order._id)}>Delete</Button>
                    </>
                  )}

                  {order.status === 'cancelled' && (
                    <p>Order Cancelled</p>
                  )}

                  {order.status === 'delivered' && (
                    <Button variant="contained" color="secondary" onClick={() => handleReviewClick(order)} sx={{ mr: 1 }}>Review & Ratings</Button>
                  )}

                  {order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'pending' && (
                    <Button variant="contained" color="info" onClick={() => setSelectedOrder(order)}>View Details</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
        <Dialog open={true} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to cancel this order?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDeleteOrder(confirmDelete)} color="error">Yes</Button>
            <Button onClick={handleCancelDelete} color="primary">No</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default OrderHistory;
