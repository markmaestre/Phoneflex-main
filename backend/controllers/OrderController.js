const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const transporter = require('../config/emailConfig'); 

exports.createOrder = async (req, res) => {
  const { products } = req.body;
  const userId = req.user._id;
  const shippingAddress = req.user.address;
  try {
    let totalPrice = 0;

    const productDetails = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);
        
        if (!product || product.stocks < item.quantity) {
          throw new Error(`Product ${product.name || 'unknown'} has insufficient stock`);
        }

     
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


    const order = new Order({
      userId,
      products: productDetails,
      totalPrice,
      shippingAddress,
    });

    await order.save();

   
    res.status(201).json({ message: 'Order created successfully', order });

  } catch (error) {
   
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email') 
      .populate('products.productId', 'name price'); 
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error: error.message });
  }
};

exports.updateOrderQuantity = async (req, res) => {
  const { orderId, productId, newQuantity } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const productInOrder = order.products.find(item => item.productId.toString() === productId);
    if (!productInOrder) return res.status(404).json({ message: 'Product not found in order' });


    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stocks < newQuantity) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}` });
    }

    productInOrder.quantity = newQuantity;

    order.totalPrice = order.products.reduce((total, item) => total + item.price * item.quantity, 0);

    await order.save();

    res.status(200).json({ message: 'Order quantity updated successfully', order });
  } catch (error) {
    res.status(400).json({ message: 'Error updating order quantity', error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('products.productId', 'name price')
      .populate('userId', 'name email'); 
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error: error.message });
  }
};




exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
   
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stocks += item.quantity;
        await product.save();
      }
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: 'Order deleted successfully' });

  } catch (error) {
    res.status(400).json({ message: 'Error deleting order', error: error.message });
  }
};
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body; 

  try {
   
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });


    order.status = status;
    await order.save();

   
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: 'your-email@mailtrap.io', 
      to: user.email, 
      subject: 'Order Status Updated',
      html: `
        <h1>Order Status Updated</h1>
        <p>Hello ${user.name},</p>
        <p>Your order (ID: ${order._id}) status has been updated to: ${order.status}.</p>
        <p>Thank you for shopping with us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);


    res.status(200).json({ message: 'Order status updated successfully', order });

  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error: error.message });
  }
};

exports.checkoutOrder = async (req, res) => {
  const { orderId, paymentMethod } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const shippingAddress = req.user.address;

    order.status = 'shipped'; 
    order.shippingAddress = shippingAddress;
    await order.save();

   
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: 'your-email@mailtrap.io',
      to: user.email, 
      subject: 'Order Confirmation', 
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

  
    await transporter.sendMail(mailOptions);


    res.status(200).json({ message: 'Order successfully processed and email sent', order });
  } catch (error) {
    res.status(400).json({ message: 'Error processing order', error: error.message });
  }
};
