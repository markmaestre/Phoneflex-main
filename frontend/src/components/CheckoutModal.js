import React, { useState } from 'react';
import './css/CheckoutModal.css'; // Import CheckoutModal CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const CheckoutModal = ({ order, onClose, onStatusUpdated }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [updatedOrder, setUpdatedOrder] = useState(order); // Local state for the updated order

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting checkout...');

    // Check if paymentMethod is empty before submitting
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          paymentMethod,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Order successfully processed:', data);
        alert('Order has been successfully processed and marked as shipped!');

        // Update the local state with the new paymentMethod and other updated info
        setUpdatedOrder({
          ...order,
          status: data.order.status, // Assuming the order status is updated on the backend
          paymentMethod: data.order.paymentMethod, // Update the paymentMethod
        });

        onStatusUpdated(data.order); // Update order status in the UI
        onClose(); // Close the modal
      } else {
        console.error('Error from backend:', data);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Failed to process order');
    }
  };

  // Disable checkout and delete if the order is already shipped
  const isOrderShipped = updatedOrder.status === 'shipped';
  const isCheckoutDisabled = isOrderShipped || !paymentMethod; // Disable button if order is shipped or payment method not selected

  return (
    <div className="checkout-modal">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Checkout</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p><strong>Order ID:</strong> {updatedOrder._id}</p>
            <p><strong>Status:</strong> {updatedOrder.status}</p>
            <p><strong>Total:</strong> ₱{updatedOrder.totalPrice.toFixed(2)}</p>
            <p><strong>Order Date:</strong> {new Date(updatedOrder.orderDate).toLocaleDateString()}</p>

            <h5>Products</h5>
            <ul className="list-group">
              {updatedOrder.products.map((item) => (
                <li className="list-group-item" key={item.productId._id}>
                  {item.productId.name} (x{item.quantity}) - ₱{(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>

            <h5 className="mt-3">User Information</h5>
            <p><strong>Address:</strong> {updatedOrder.shippingAddress}</p>

            {isOrderShipped ? (
              <p className="text-danger">This order has already been checked out and cannot be modified.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Payment Method:</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCheckoutDisabled}
                  >
                    Confirm Payment
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
