import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      profilePicture: 'https://via.placeholder.com/100',
      address: '123 Main St, Cityville',
      purchaseHistory: [
        { product: 'Laptop', date: '2024-01-15', amount: '$1200' },
        { product: 'Smartphone', date: '2024-03-12', amount: '$800' }
      ],
      queries: [
        { query: 'My order is delayed.', status: 'Open' },
        { query: 'Product damaged on arrival.', status: 'Closed' }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      profilePicture: 'https://via.placeholder.com/100',
      address: '456 Oak St, Townsville',
      purchaseHistory: [
        { product: 'Headphones', date: '2024-02-20', amount: '$200' },
        { product: 'Smartwatch', date: '2024-04-05', amount: '$300' }
      ],
      queries: [
        { query: 'Received wrong product.', status: 'Open' }
      ]
    }
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  // Handle responding to a query
  const handleRespondToQuery = (customerId, queryIndex, response) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        customer.queries[queryIndex].status = 'Resolved';
        customer.queries[queryIndex].response = response;
      }
      return customer;
    });
    setCustomers(updatedCustomers);
  };

  return (
    <animated.div style={fadeIn} className="customer-management-container">
      <h1>Customer Management</h1>
      <div className="customer-list">
        <h2>Customers</h2>
        <div className="customer-cards">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="customer-card"
              onClick={() => setSelectedCustomer(customer)}
            >
              <img
                src={customer.profilePicture}
                alt={`${customer.name}'s profile`}
                className="profile-picture"
              />
              <div className="customer-details">
                <h3>{customer.name}</h3>
                <p>{customer.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCustomer && (
        <div className="customer-details-container">
          <h2>Customer Details</h2>
          <div className="customer-info">
            <img
              src={selectedCustomer.profilePicture}
              alt={`${selectedCustomer.name}'s profile`}
              className="profile-picture-large"
            />
            <div>
              <h3>{selectedCustomer.name}</h3>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Address:</strong> {selectedCustomer.address}</p>
            </div>
          </div>

          <h3>Purchase History</h3>
          <ul className="purchase-history">
            {selectedCustomer.purchaseHistory.map((purchase, index) => (
              <li key={index}>
                <p><strong>Product:</strong> {purchase.product}</p>
                <p><strong>Date:</strong> {purchase.date}</p>
                <p><strong>Amount:</strong> {purchase.amount}</p>
              </li>
            ))}
          </ul>

          <h3>Customer Support Queries</h3>
          <ul className="queries-list">
            {selectedCustomer.queries.map((query, index) => (
              <li key={index} className={query.status === 'Open' ? 'open-query' : 'resolved-query'}>
                <p><strong>Query:</strong> {query.query}</p>
                <p><strong>Status:</strong> {query.status}</p>
                {query.status === 'Open' && (
                  <div>
                    <textarea
                      placeholder="Respond to the query"
                      onBlur={(e) =>
                        handleRespondToQuery(selectedCustomer.id, index, e.target.value)
                      }
                    />
                    <button onClick={() => handleRespondToQuery(selectedCustomer.id, index, 'Resolved')}>Mark as Resolved</button>
                  </div>
                )}
                {query.status === 'Resolved' && (
                  <p><strong>Response:</strong> {query.response}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </animated.div>
  );
};

export default CustomerManagement;
