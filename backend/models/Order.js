const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled', 'success'], default: 'pending' },
  orderDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['credit_card', 'cash_on_delivery'], default: 'cash_on_delivery' },
  shippingAddress: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
