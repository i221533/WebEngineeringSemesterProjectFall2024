const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  color: { type: String },
  size: { type: String },
  type: { type: String },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Stores the filename
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
