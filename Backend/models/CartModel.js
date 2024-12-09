const mongoose = require('mongoose');

// Define the Cart Schema
const cartSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,  // Ensure each user (email) has a unique cart
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',  // Reference to the Product collection
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        // Additional properties like size, color can be added here
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;