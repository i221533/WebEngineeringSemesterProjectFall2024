import React, { useEffect, useState } from "react";
import "./ProductGallery.css"; // Optional CSS for styling

const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="product-gallery">
      <h2>Product Gallery</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <img
              src={`http://localhost:5001/uploads/${product.image}`}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>Stock: {product.stock}</p>
            <p>Category: {product.category}</p>
            <p>Color: {product.color}</p>
            <p>Size: {product.size}</p>
            <p>Type: {product.type}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGallery;
