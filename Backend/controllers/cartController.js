const Product = require('../models/Product');
const Cart = require('../models/CartModel');
  // Assuming a Product model exists

// Add item to cart
exports.addToCart = async (req, res) => {
  const { email } = req.body; // User email
  const { productId, quantity } = req.body; // Product details

  try {
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    
    let userCart = await Cart.findOne({ email });

    if (!userCart) {
     
      userCart = new Cart({ email, items: [{ productId, quantity }] });
    } else {
      
      const itemIndex = userCart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (itemIndex >= 0) {
       
        userCart.items[itemIndex].quantity += quantity;
      } else {
        
        userCart.items.push({ productId, quantity });
      }
    }

    await userCart.save();
    res.status(200).json({ message: 'Product added to cart successfully.', cart: userCart });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

// Get user cart by email
exports.getCart = async (req, res) => {
    const { email } = req.params;

    try {
      const userCart = await Cart.findOne({ email });
      if (!userCart) {
        return res.status(404).json({ message: 'No cart found for this user.' });
      }
  
      // Count the total quantity of items in the cart
      const totalItems = userCart.items.reduce((sum, item) => sum + item.quantity, 0);
      res.status(200).json({ totalItems });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error });
    }
};
exports.getCartItems = async (req, res) => {
    const { email } = req.params;
  
    try {
      // Find the user's cart and populate product details
      const userCart = await Cart.findOne({ email }).populate('items.productId');
      
      if (!userCart) {
        return res.status(404).json({ message: 'No cart found for this user.' });
      }
  
      // Respond with all cart items
      res.status(200).json({ items: userCart.items });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error });
    }
  };

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { email, productId } = req.params;

  try {
    const userCart = await Cart.findOne({ email });
    if (!userCart) {
      return res.status(404).json({ message: 'No cart found for this user.' });
    }

    // Remove the product from the cart
    userCart.items = userCart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await userCart.save();
    res.status(200).json({ message: 'Product removed from cart.', cart: userCart });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
