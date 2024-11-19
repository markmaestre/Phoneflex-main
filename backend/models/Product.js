const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  stocks: { type: Number, required: true, default: 0 },
  totalRatings: { type: Number, required: true, default: 0 },
  ratingCount: { type: Number, required: true, default: 0 },

});

module.exports = mongoose.model('Product', productSchema);
