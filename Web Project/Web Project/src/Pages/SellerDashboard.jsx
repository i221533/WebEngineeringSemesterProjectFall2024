import React, { useState, useEffect } from 'react';
import { 
  Package, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  RefreshCw, 
  ChevronDown, 
  BarChart2,
  Edit,
  Trash2,
  PlusCircle,
  Eye
} from 'lucide-react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const SellerDashboard = () => {
  // State Management
  const [metrics, setMetrics] = useState({
    totalSales: 15430,
    pendingOrders: 24,
    productsListed: 68,
    revenue: 7250,
  });

  const [orders, setOrders] = useState([
    { id: 'ORD-001', product: 'Wireless Headphones', status: 'Processing', total: 129.99, customer: 'John Doe' },
    { id: 'ORD-002', product: 'Smart Watch', status: 'Shipped', total: 199.50, customer: 'Jane Smith' },
    { id: 'ORD-003', product: 'Bluetooth Speaker', status: 'Pending', total: 79.99, customer: 'Mike Johnson' },
  ]);

  const [inventory, setInventory] = useState([
    { id: 1, name: 'Wireless Headphones', stock: 45, price: 129.99, category: 'Electronics' },
    { id: 2, name: 'Smart Watch', stock: 12, price: 199.50, category: 'Wearables' },
    { id: 3, name: 'Bluetooth Speaker', stock: 30, price: 79.99, category: 'Audio' },
  ]);

  // Chart Data
  const productSalesData = [
    { name: 'Wireless Headphones', value: 400 },
    { name: 'Smart Watch', value: 300 },
    { name: 'Bluetooth Speaker', value: 200 },
  ];

  const categorySalesData = [
    { category: 'Electronics', sales: 1200 },
    { category: 'Wearables', sales: 900 },
    { category: 'Audio', sales: 600 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Modal States
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Product Management Functions
  const handleAddProduct = (newProduct) => {
    setInventory([...inventory, { 
      id: inventory.length + 1, 
      ...newProduct 
    }]);
    setIsAddProductModalOpen(false);
  };

  const handleEditProduct = (updatedProduct) => {
    setInventory(inventory.map(product => 
      product.id === selectedProduct.id ? { ...product, ...updatedProduct } : product
    ));
    setIsEditProductModalOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    setInventory(inventory.filter(product => product.id !== productId));
  };

  // Product Modal Component
  const ProductModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    product = null, 
    isEdit = false 
  }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      stock: product?.stock || 0,
      price: product?.price || 0,
      category: product?.category || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg w-96">
          <h2 className="text-2xl font-bold mb-6">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              step="0.01"
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isEdit ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Seller Central</h1>
        <div className="flex space-x-4">
          <button 
            className="flex items-center bg-white border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <RefreshCw className="mr-2 w-4 h-4" /> Refresh Data
          </button>
          <button 
            onClick={() => setIsAddProductModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="mr-2 w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(metrics).map(([key, value]) => (
          <div 
            key={key} 
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md font-semibold text-gray-600 uppercase tracking-wide">
                {key.replace(/([A-Z])/g, " $1")}
              </h2>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {typeof value === "number" ? `$${value.toLocaleString()}` : value}
            </p>
          </div>
        ))}
      </div>

      {/* Inventory Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Product Inventory</h2>
        </div>
        <div className="space-y-4">
          {inventory.map((product) => (
            <div 
              key={product.id} 
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsEditProductModalOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </button>
                <button 
                  className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Product Sales Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Product Sales Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productSalesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {productSalesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Sales Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSubmit={handleAddProduct}
      />
      <ProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => setIsEditProductModalOpen(false)}
        onSubmit={handleEditProduct}
        product={selectedProduct}
        isEdit={true}
      />
    </div>
  );
};

export default SellerDashboard;