import React, { useState, useEffect } from 'react';
import './css/CheckoutModal.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

const CheckoutModal = ({ order, onClose, onStatusUpdated }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [updatedOrder, setUpdatedOrder] = useState(order); 
  

  const [productQuantities, setProductQuantities] = useState(
    order.products.reduce((acc, item) => {
      acc[item.productId._id] = item.quantity;
      return acc;
    }, {})
  );

  useEffect(() => {
   
    setUpdatedOrder(order);
    setProductQuantities(order.products.reduce((acc, item) => {
      acc[item.productId._id] = item.quantity;
      return acc;
    }, {}));
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting checkout...');

  
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

        setUpdatedOrder({
          ...order,
          status: data.order.status, 
          paymentMethod: data.order.paymentMethod, 
        });

        onStatusUpdated(data.order); 
        onClose(); 
      } else {
        console.error('Error from backend:', data);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Failed to process order');
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  const updateProductQuantity = async (productId) => {
    const newQuantity = productQuantities[productId];
    if (newQuantity <= 0) return; 

    try {
      const response = await fetch('http://localhost:5000/api/orders/:orderId/updateQuantity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          productId,
          newQuantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Quantity updated successfully');
        setUpdatedOrder(data.order);
        onStatusUpdated(data.order); 
      } else {
        console.error('Error from backend:', data);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const isOrderShipped = updatedOrder.status === 'shipped';
  const isCheckoutDisabled = isOrderShipped || !paymentMethod; 
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
                  {!isOrderShipped && (
                    <div className="mt-2">
                      <label>Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={productQuantities[item.productId._id]}
                        onChange={(e) => handleQuantityChange(item.productId._id, e.target.value)}
                        className="form-control"
                      />
                      <button
                        className="btn btn-sm btn-warning mt-2"
                        onClick={() => updateProductQuantity(item.productId._id)}
                      >
                        Update Quantity
                      </button>
                    </div>
                  )}
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
