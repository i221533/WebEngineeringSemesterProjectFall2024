import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    { id: 1, status: 'Pending', customer: 'John Doe', amount: '$100' },
    { id: 2, status: 'Shipped', customer: 'Jane Smith', amount: '$200' },
    { id: 3, status: 'Delivered', customer: 'Sam Wilson', amount: '$150' },
    { id: 4, status: 'Pending', customer: 'Lucy Brown', amount: '$250' },
    { id: 5, status: 'Shipped', customer: 'Mike White', amount: '$120' },
  ]);

  const [filter, setFilter] = useState({ status: 'All', customer: '', amount: '' });
  const [loading, setLoading] = useState(false);

  // Function to handle the filter input changes
  const handleFilterChange = (e, type) => {
    const value = e.target.value;

    // Update the corresponding filter type in the state
    setFilter(prevFilter => ({
      ...prevFilter,
      [type]: value,
    }));

    // Simulate a loading process (you can replace this with actual API calls)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);  // Stop loading after a brief delay
    }, 1000);
  };

  // Filter the orders based on the current filter values
  const filteredOrders = orders.filter((order) => {
    return (
      (filter.status === 'All' || order.status === filter.status) &&
      order.customer.toLowerCase().includes(filter.customer.toLowerCase()) &&
      order.amount.includes(filter.amount)
    );
  });

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  return (
    <animated.div style={fadeIn} className="order-management">
      <div className="sidebar">
        <h2>Filters</h2>

        {/* Filter by status */}
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            onChange={(e) => handleFilterChange(e, 'status')}
            value={filter.status}
            className="filter-dropdown"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {/* Filter by customer */}
        <div className="filter-group">
          <label htmlFor="customer-filter">Customer Name:</label>
          <input
            id="customer-filter"
            type="text"
            value={filter.customer}
            onChange={(e) => handleFilterChange(e, 'customer')}
            placeholder="Search by customer"
          />
        </div>

        {/* Filter by amount */}
        <div className="filter-group">
          <label htmlFor="amount-filter">Amount:</label>
          <input
            id="amount-filter"
            type="text"
            value={filter.amount}
            onChange={(e) => handleFilterChange(e, 'amount')}
            placeholder="Search by amount"
          />
        </div>
      </div>

      <div className="main-content">
        <h1 className="title">Order Management</h1>

        {/* Show loading spinner while applying filters */}
        {loading ? (
          <div className="loading-spinner">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="#3498db"
            >
              <circle cx="20" cy="20" r="18" strokeWidth="4" strokeLinecap="round"></circle>
              <path
                fill="none"
                stroke="#3498db"
                strokeWidth="4"
                strokeLinecap="round"
                d="M 2,20 A 18,18 0 1,1 38,20 A 18,18 0 1,1 2,20"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 20 20"
                  to="360 20 20"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <animated.div
                  key={order.id}
                  className={`order-card ${order.status.toLowerCase()}`}
                  style={useSpring({ transform: 'scale(1)', from: { transform: 'scale(0.9)' }, delay: 200 })}
                >
                  <h3>Order #{order.id}</h3>
                  <p><strong>Customer:</strong> {order.customer}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Amount:</strong> {order.amount}</p>
                </animated.div>
              ))
            ) : (
              <p>No orders found for the selected filters.</p>
            )}
          </div>
        )}
      </div>
    </animated.div>
  );
};

export default OrderManagement;
