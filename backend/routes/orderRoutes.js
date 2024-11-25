const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/orders', authMiddleware, orderController.createOrder); 
router.get('/orders/user', authMiddleware, orderController.getUserOrders); 
router.delete('/orders/:orderId', authMiddleware, orderController.deleteOrder); 
router.post('/orders/checkout', authMiddleware, orderController.checkoutOrder); 
router.get('/orders', authMiddleware, orderController.getAllOrders); 


router.put('/orders/:orderId/updateQuantity', authMiddleware, orderController.updateOrderQuantity);
router.post('/orders/update-status', authMiddleware, orderController.updateOrderStatus); 


module.exports = router;
