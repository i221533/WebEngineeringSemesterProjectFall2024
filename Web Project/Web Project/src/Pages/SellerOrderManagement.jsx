import React, { useState } from "react";

const SellerOrderManagement = () => {
  // Extended order data with more details
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      customer: "John Doe", 
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      amount: 120.50, 
      status: "Pending",
      items: [
        { name: "Blue T-Shirt", quantity: 2, price: 45.00 },
        { name: "Black Jeans", quantity: 1, price: 75.50 }
      ],
      shippingAddress: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345"
      },
      orderDate: new Date("2024-02-15"),
      paymentMethod: "Credit Card",
      trackingNumber: null,
      returnReason: null
    },
    { 
      id: 2, 
      customer: "Jane Smith", 
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      amount: 80.75, 
      status: "Shipped",
      items: [
        { name: "Red Hoodie", quantity: 1, price: 80.75 }
      ],
      shippingAddress: {
        street: "456 Oak Avenue",
        city: "Somewhere",
        state: "NY", 
        zipCode: "67890"
      },
      orderDate: new Date("2024-02-20"),
      paymentMethod: "PayPal",
      trackingNumber: "1Z999AA1012345678",
      returnReason: null
    }
  ]);

  // State for modals and detailed views
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnDetails, setReturnDetails] = useState({
    orderId: null,
    reason: "",
    itemsToReturn: []
  });

  // Order Status Update
  const updateOrderStatus = (id, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === id 
        ? { 
            ...order, 
            status: newStatus,
            trackingNumber: newStatus === "Shipped" 
              ? generateTrackingNumber() 
              : order.trackingNumber
          } 
        : order
    );
    setOrders(updatedOrders);
  };

  // Generate Random Tracking Number
  const generateTrackingNumber = () => {
    return `1Z${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  };

  // Open Order Details Modal
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  // Initiate Return Process
  const initiateReturn = (order) => {
    setReturnDetails({
      orderId: order.id,
      reason: "",
      itemsToReturn: order.items.map(item => ({
        ...item,
        returnQuantity: 0
      }))
    });
    setIsReturnModalOpen(true);
  };

  // Handle Return Submission
  const submitReturn = () => {
    const returnedItems = returnDetails.itemsToReturn.filter(item => item.returnQuantity > 0);
    
    if (returnedItems.length === 0) {
      alert("Please select items to return");
      return;
    }

    const updatedOrders = orders.map(order => 
      order.id === returnDetails.orderId
        ? { 
            ...order, 
            status: "Returned",
            returnReason: returnDetails.reason,
            returnedItems: returnedItems
          }
        : order
    );

    setOrders(updatedOrders);
    setIsReturnModalOpen(false);
  };

  // Calculate Total Order Value
  const calculateOrderTotal = (order) => {
    return order.items.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Order Management</h1>
        
        {/* Order Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Pending Orders</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(order => order.status === "Pending").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Shipped Orders</h3>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(order => order.status === "Shipped").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
            <p className="text-2xl font-bold text-purple-600">
              ${orders.reduce((total, order) => total + order.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">${order.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-semibold
                        ${order.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                          order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                          order.status === "Delivered" ? "bg-green-100 text-green-800" :
                          order.status === "Returned" ? "bg-red-100 text-red-800" : ""
                        }
                      `}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      View Details
                    </button>
                    {order.status === "Pending" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "Shipped")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                      >
                        Ship Order
                      </button>
                    )}
                    {(order.status === "Shipped" || order.status === "Delivered") && (
                      <button
                        onClick={() => initiateReturn(order)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Return/Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Details Modal */}
        {isOrderDetailsModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] p-6">
              <h2 className="text-2xl font-bold mb-4">Order #{selectedOrder.id} Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Customer Information</h3>
                  <p>{selectedOrder.customer}</p>
                  <p>{selectedOrder.email}</p>
                  <p>{selectedOrder.phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold">Order Items</h3>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Product</th>
                      <th className="text-left">Quantity</th>
                      <th className="text-left">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  <p><strong>Order Date:</strong> {selectedOrder.orderDate.toLocaleDateString()}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  {selectedOrder.trackingNumber && (
                    <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">Total: ${calculateOrderTotal(selectedOrder)}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setIsOrderDetailsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Return Modal */}
        {isReturnModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[500px] p-6">
              <h2 className="text-2xl font-bold mb-4">Return/Refund Process</h2>
              
              <div>
                <h3 className="font-semibold mb-2">Select Items to Return</h3>
                {returnDetails.itemsToReturn.map((item, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <span className="flex-grow">{item.name}</span>
                    <input
                      type="number"
                      min="0"
                      max={item.quantity}
                      value={item.returnQuantity}
                      onChange={(e) => {
                        const newItems = [...returnDetails.itemsToReturn];
                        newItems[index].returnQuantity = Number(e.target.value);
                        setReturnDetails({...returnDetails, itemsToReturn: newItems});
                      }}
                      className="w-20 border rounded px-2 py-1"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block mb-2 font-semibold">Return Reason</label>
                <textarea
                  value={returnDetails.reason}
                  onChange={(e) => setReturnDetails({...returnDetails, reason: e.target.value})}
                  className="w-full border rounded p-2"
                  rows="3"
                  placeholder="Please explain the reason for return"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setIsReturnModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReturn}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Submit Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrderManagement;