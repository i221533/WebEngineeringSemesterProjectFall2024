import React, { useState, useEffect } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import './ProductManagement.css';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/products");
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products);
        } else {
          setError(data.message || "Failed to fetch products");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product with confirmation and API call
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        // Call the API to delete the product
        const response = await fetch(`http://localhost:5001/api/products/deleteProduct/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the deleted product from the local state
          setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
          setSuccessMessage('Product deleted successfully!');
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to delete product');
        }
      } catch (err) {
        setError('Something went wrong while deleting the product.');
      }
    }
  };

  // Animations for the entire product list
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  // Animations for individual products
  const fadeInProduct = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(50px)' },
    config: config.gentle,
  });

  return (
    <animated.div style={fadeIn} className="product-management-container">
      <header className="header">
        <h1 className="title">Product Management Dashboard</h1>
      </header>
      <main className="main-content">
        <section className="product-list-section">
          <div className="header-actions">
            <Link to='/addproduct'>
              <button className="btn btn-add" type="button">
                Add Product
              </button>
            </Link> 
          </div>
          <h2 className="section-title">Product Inventory</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : products.length > 0 ? (
            <ul className="product-grid">
              {products.map((product) => (
                <animated.li
                  key={product._id}
                  className="product-card"
                  style={fadeInProduct} // Use the pre-defined animation
                >
                  <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-info"><span>Category:</span> {product.category}</p>
                    <p className="product-info"><span>Type:</span> {product.type}</p>
                    <p className="product-info"><span>Color:</span> {product.color}</p>
                    <p className="product-info"><span>Size:</span> {product.size}</p>
                    <p className="product-info"><span>Stock:</span> {product.stock}</p>
                    <p className="product-info"><span>Price:</span> {product.price}</p>
                  </div>
                  <div className="product-actions">
                    <button
                     // Fixed the id to match the database field
                      className="btn btn-edit"
                      type="button"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)} // Fixed the id to match the database field
                      className="btn btn-delete"
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </animated.li>
              ))}
            </ul>
          ) : (
            <p className="no-products">No products available</p>
          )}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </section>
      </main>
    </animated.div>
  );
};

export default ProductManagement;
