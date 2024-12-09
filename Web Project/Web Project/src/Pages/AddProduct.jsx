import React, { useState } from "react";
import "./ProductManagement.css";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    stock: "",
    category: "",
    color: "",
    size: "",
    type: "",
    price:"",
  });

  const [imageFile, setImageFile] = useState(null); // Store the file
  const [message, setMessage] = useState({ type: "", text: "" });

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setMessage({
          type: "error",
          text: "File size exceeds 5MB. Please upload a smaller image.",
        });
        setTimeout(() => setMessage(""), 3000);
        return;
      }
      setImageFile(file);
      setMessage({ type: "success", text: "Image successfully added." });
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setMessage({ type: "error", text: "Please upload an image." });
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("stock", productData.stock);
    formData.append("category", productData.category);
    formData.append("color", productData.color);
    formData.append("size", productData.size);
    formData.append("type", productData.type);
    formData.append("price", productData.price);
    formData.append("image", imageFile); // Append the image file

    try {
      const response = await fetch("http://localhost:5001/api/products/add", {
        method: "POST",
        body: formData, // Send FormData
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: result.message });
        setTimeout(() => setMessage(""), 3000);
        setProductData({
          name: "",
          stock: "",
          category: "",
          color: "",
          size: "",
          type: "",
          price:""
        });
        setImageFile(null);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to add product.",
        });
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <section className="product-form-section">
      <h2 className="section-title">Add New Product</h2>

      {message.text && (
        <div
          className={`message ${message.type === "success" ? "success" : "error"}`}
        >
          {message.text}
        </div>
      )}

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            id="productName"
            type="text"
            placeholder="Enter product name"
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="productStock">Stock</label>
          <input
            id="productStock"
            type="number"
            placeholder="Enter stock quantity"
            value={productData.stock}
            onChange={(e) =>
              setProductData({ ...productData, stock: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="productCategory">Category</label>
          <input
            id="productCategory"
            type="text"
            placeholder="Enter product category"
            value={productData.category}
            onChange={(e) =>
              setProductData({ ...productData, category: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="productColor">Color</label>
          <input
            id="productColor"
            type="text"
            placeholder="Enter product color"
            value={productData.color}
            onChange={(e) =>
              setProductData({ ...productData, color: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="productSize">Size</label>
          <input
            id="productSize"
            type="text"
            placeholder="Enter product size"
            value={productData.size}
            onChange={(e) =>
              setProductData({ ...productData, size: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="productType">Type</label>
          <input
            id="productType"
            type="text"
            placeholder="Enter product type"
            value={productData.type}
            onChange={(e) =>
              setProductData({ ...productData, type: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="productColor">Price</label>
          <input
            id="productColor"
            type="number"
            placeholder="Enter product color"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="productImage">Image</label>
          <input
            id="productImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button className="btn-add" type="submit">
          Add Product
        </button>
      </form>
    </section>
  );
};

export default AddProduct;
