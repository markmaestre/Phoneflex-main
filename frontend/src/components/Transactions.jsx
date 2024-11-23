import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/transactions.css'; // Import your CSS file

const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      toast.error('Error fetching orders');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Order ${orderId} status updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      toast.error('Error updating order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleBackClick = () => {
    // Navigate back to the user dashboard using window.location.href
    window.location.href = '/admin-dashboard';
  };

  return (
    <div className="transactions-container">
      <Button variant="secondary" onClick={handleBackClick} style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </Button>
      <h2>Transactions</h2>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total Price</th>
              <th>Products</th>
              <th>Shipping Address</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                style={{
                  backgroundColor:
                    order.status === 'shipped'
                      ? '#d4edda'
                      : order.status === 'delivered'
                      ? '#fff3cd'
                      : order.status === 'cancelled'
                      ? '#f8d7da'
                      : 'white',
                }}
              >
                <td>{order._id}</td>
                <td>{order.userId ? order.userId.name : 'No Name'}</td>
                <td>{order.totalPrice ? `₱${order.totalPrice.toFixed(2)}` : 'N/A'}</td>
                <td>
                  {order.products && Array.isArray(order.products)
                    ? order.products
                        .map((product) => product.productId.name || 'Unknown Product')
                        .join(', ')
                    : 'No products available'}
                </td>
                <td>{order.shippingAddress || 'N/A'}</td>
                <td>{order.paymentMethod || 'N/A'}</td>
                <td>{order.status}</td>
                <td>
                  {updatingOrderId === order._id ? (
                    <Spinner animation="border" size="sm" />
                  ) : order.status !== 'cancelled' && order.status !== 'delivered' ? (
                    <>
                      {order.status !== 'shipped' && (
                        <Button
                          variant="success"
                          onClick={() => handleUpdateStatus(order._id, 'shipped')}
                        >
                          Mark as Shipped
                        </Button>
                      )}
                      {order.status !== 'delivered' && (
                        <Button
                          variant="warning"
                          onClick={() => handleUpdateStatus(order._id, 'delivered')}
                        >
                          Mark as Delivered
                        </Button>
                      )}
                      {order.status !== 'cancelled' && (
                        <Button
                          variant="danger"
                          onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                        >
                          Mark as Cancelled
                        </Button>
                      )}
                    </>
                  ) : (
                    <span>No actions available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Transactions;
