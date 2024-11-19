const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes
router.post('/orders', authMiddleware, orderController.createOrder); // Create an order
router.get('/orders/user', authMiddleware, orderController.getUserOrders); // Get all user orders
router.delete('/orders/:orderId', authMiddleware, orderController.deleteOrder); // Delete an order
router.post('/orders/checkout', authMiddleware, orderController.checkoutOrder); // Checkout and process payment
router.get('/orders', authMiddleware, orderController.getAllOrders); // Admin view all orders
// Routes
router.post('/orders/update-status', authMiddleware, orderController.updateOrderStatus);  // Update order status


module.exports = router;
