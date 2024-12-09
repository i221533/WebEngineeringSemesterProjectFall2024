const Product = require('../models/Product');
const fs = require('fs');

exports.addProduct = async (req, res) => {
    try {
        const { name, stock, category, color, size, type,price } = req.body;
    
        // Check if an image was uploaded
        if (!req.file) {
          return res.status(400).json({ message: 'Image file is required.' });
        }
    
        const newProduct = new Product({
          name,
          stock,
          category,
          color,
          size,
          type,
          price,
          image: req.file.filename, // Save the uploaded file's filename
        });
    
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the product.' });
      }
  };
  exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find(); // Fetch all products
      res.status(200).json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching products", error });
    }
  };
// Update Product

exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params; // Get the product ID from request parameters
  
      // Try to find and delete the product by its ID
      const deletedProduct = await Product.findByIdAndDelete(id);
  
      // If no product is found, return an error
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // If deletion is successful, return a success message
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      // If any error occurs, send an internal server error message
      console.error(err);
      res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
  };