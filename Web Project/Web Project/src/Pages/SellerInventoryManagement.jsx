import React, { useState, useRef } from 'react';

const SellerInventoryManagement = () => {
  const [inventory, setInventory] = useState([
    { 
      id: 1, 
      name: "T-Shirt", 
      stock: 30, 
      price: 19.99, 
      description: "Comfortable cotton t-shirt",
      category: "Clothing",
      imageUrl: null
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    stock: 0,
    price: 0,
    description: '',
    category: '',
    imageUrl: null
  });

  // Image upload ref
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Handle image upload for new product
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload for editing product
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProduct(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Restock functionality
  const handleRestock = (id) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, stock: item.stock + 10 } : item
    ));
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  // Edit product
  const handleEditProduct = (product) => {
    setSelectedProduct({...product});
  };

  // Save edited product
  const saveEditedProduct = () => {
    setInventory(inventory.map(item => 
      item.id === selectedProduct.id ? selectedProduct : item
    ));
    setSelectedProduct(null);
  };

  // Add new product
  const handleAddProduct = () => {
    // Validate inputs
    if (!newProduct.name || newProduct.stock < 0 || newProduct.price < 0) {
      alert('Please fill all required fields correctly');
      return;
    }

    const newProductWithId = {
      ...newProduct,
      id: inventory.length > 0 ? Math.max(...inventory.map(i => i.id)) + 1 : 1,
    };
    setInventory([...inventory, newProductWithId]);
    
    // Reset form
    setNewProduct({
      name: '',
      stock: 0,
      price: 0,
      description: '',
      category: '',
      imageUrl: null
    });
    setIsAddProductModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Inventory Management</h2>
          <button 
            onClick={() => setIsAddProductModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            + Add New Product
          </button>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border">Product Image</th>
                <th className="p-3 text-left border">Product Name</th>
                <th className="p-3 text-left border">Stock</th>
                <th className="p-3 text-left border">Price</th>
                <th className="p-3 text-left border">Category</th>
                <th className="p-3 text-left border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3 border">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="p-3 border">{item.name}</td>
                  <td className="p-3 border">{item.stock}</td>
                  <td className="p-3 border">${item.price.toFixed(2)}</td>
                  <td className="p-3 border">{item.category}</td>
                  <td className="p-3 border">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleRestock(item.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Restock
                      </button>
                      <button 
                        onClick={() => handleEditProduct(item)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Product Modal */}
        {isAddProductModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[500px] p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Add New Product</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Image Upload */}
                <div className="flex flex-col items-center">
                  {newProduct.imageUrl ? (
                    <img 
                      src={newProduct.imageUrl} 
                      alt="Product Preview" 
                      className="w-48 h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      No Image Selected
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Upload Image
                  </button>
                </div>

                {/* Product Details */}
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full border p-2 rounded"
                />
                <textarea
                  placeholder="Product Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full border p-2 rounded"
                  rows="3"
                />

                {/* Modal Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                  <button 
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddProduct}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[500px] p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Edit Product</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Image Upload */}
                <div className="flex flex-col items-center">
                  {selectedProduct.imageUrl ? (
                    <img 
                      src={selectedProduct.imageUrl} 
                      alt="Product Preview" 
                      className="w-48 h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      No Image Selected
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={editFileInputRef}
                    onChange={handleEditImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    onClick={() => editFileInputRef.current.click()}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Change Image
                  </button>
                </div>

                {/* Product Details */}
                <input
                  type="text"
                  placeholder="Product Name"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={selectedProduct.stock}
                  onChange={(e) => setSelectedProduct({...selectedProduct, stock: Number(e.target.value)})}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({...selectedProduct, price: Number(e.target.value)})}
                  className="w-full border p-2 rounded"
                />

                {/* Modal Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveEditedProduct}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInventoryManagement;