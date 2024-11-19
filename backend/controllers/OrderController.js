const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const transporter = require('../config/emailConfig'); // Import Mailtrap config for email sending

// Create Order
exports.createOrder = async (req, res) => {
  const { products } = req.body;
  const userId = req.user._id;
  const shippingAddress = req.user.address; // Automatically get address from logged-in user
  
  try {
    let totalPrice = 0;
    
    // Calculate total price and update stock
    const productDetails = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);
        
        if (!product || product.stocks < item.quantity) {
          throw new Error(`Product ${product.name || 'unknown'} has insufficient stock`);
        }

        // Update stock
        product.stocks -= item.quantity;
        await product.save();

        totalPrice += product.price * item.quantity;

        return { 
          productId: product._id, 
          quantity: item.quantity, 
          price: product.price 
        };
      })
    );

    // Create the order with the calculated total price and product details
    const order = new Order({
      userId,
      products: productDetails,
      totalPrice,
      shippingAddress,
    });

    await order.save();

    // Return a success response with the order data
    res.status(201).json({ message: 'Order created successfully', order });

  } catch (error) {
    // Return an error response if something goes wrong
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email') // populate user info if needed
      .populate('products.productId', 'name price'); // populate product info
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error: error.message });
  }
};
// Get Orders for a User
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('products.productId', 'name price')
      .populate('userId', 'name email'); // Ensure user info is populated
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error: error.message });
  }
};




// Delete Order
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Restore product stock if order is deleted
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stocks += item.quantity;
        await product.save();
      }
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: 'Order deleted successfully' });

  } catch (error) {
    res.status(400).json({ message: 'Error deleting order', error: error.message });
  }
};
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;  // The new status for the order

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Update the order status
    order.status = status;
    await order.save();

   
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: 'your-email@mailtrap.io', // Mailtrap sender address
      to: user.email, // Recipient address
      subject: 'Order Status Updated', // Email subject
      html: `
        <h1>Order Status Updated</h1>
        <p>Hello ${user.name},</p>
        <p>Your order (ID: ${order._id}) status has been updated to: ${order.status}.</p>
        <p>Thank you for shopping with us!</p>
      `,
    };

    // Send the email via the transporter
    await transporter.sendMail(mailOptions);

    // Respond with the updated order
    res.status(200).json({ message: 'Order status updated successfully', order });

  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error: error.message });
  }
};
// Checkout Order
exports.checkoutOrder = async (req, res) => {
  const { orderId, paymentMethod } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Automatically get address from user
    const shippingAddress = req.user.address;

    // Update the order status to 'shipped' or 'processing' after payment
    order.status = 'shipped'; // or 'processing'
    order.shippingAddress = shippingAddress;
    await order.save();

    // Send confirmation email to the user
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: 'your-email@mailtrap.io', // Mailtrap sender address
      to: user.email, // Recipient address
      subject: 'Order Confirmation', // Email subject
      html: `
        <h1>Thank you for your order, ${user.name}!</h1>
        <p>Your order has been successfully processed and is now in the shipping process.</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total Price:</strong> ₱${order.totalPrice.toFixed(2)}</p>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
        <p>We will notify you once your order is shipped.</p>
        <p>Thank you for shopping with us!</p>
      `,
    };

    // Send the email via the transporter
    await transporter.sendMail(mailOptions);

    // Respond to the client
    res.status(200).json({ message: 'Order successfully processed and email sent', order });
  } catch (error) {
    res.status(400).json({ message: 'Error processing order', error: error.message });
  }
};
