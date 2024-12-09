import React, { useState } from "react";

const SellerProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "T-Shirt", price: 25, stock: 30, description: "Comfortable cotton T-shirt" },
    { id: 2, name: "Jeans", price: 40, stock: 15, description: "Slim-fit blue jeans" },
  ]);

  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", description: "" });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      setProducts([
        ...products,
        {
          id: products.length + 1,
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
        },
      ]);
      setNewProduct({ name: "", price: "", stock: "", description: "" });
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>

      {/* Add New Product Form */}
      <div className="mb-6 bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["name", "price", "stock", "description"].map((field) => (
            <input
              key={field}
              type={field === "price" || field === "stock" ? "number" : "text"}
              placeholder={`Enter ${field}`}
              value={newProduct[field]}
              onChange={(e) => setNewProduct({ ...newProduct, [field]: e.target.value })}
              className="p-2 border rounded w-full"
            />
          ))}
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      {/* Product List */}
      <table className="min-w-full bg-white border shadow rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Product Name</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Stock</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">${product.price}</td>
              <td className="py-2 px-4 border-b">{product.stock}</td>
              <td className="py-2 px-4 border-b">{product.description}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerProductManagement;
