import { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { FaTrash } from 'react-icons/fa';
import {Link} from 'react-router-dom'
const Usercarts = () => {
  const { userEmail, fetchCartItemCount } = useContext(ShopContext); // User email from context
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProductPrice, setTotalProductPrice] = useState(0);

  const shippingPrice = 10; // Fixed shipping price

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/cart/usercart/${userEmail}`);
      const data = await response.json();

      if (response.ok) {
        setCartItems(data.items);
        calculateTotalProductPrice(data.items);
      } else {
        setError(data.message || 'Failed to fetch cart items.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalProductPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.quantity * item.productId.price, 0);
    setTotalProductPrice(total);
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/cart/remove/${userEmail}/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCartItems = cartItems.filter((item) => item.productId._id !== productId);
        setCartItems(updatedCartItems);
        calculateTotalProductPrice(updatedCartItems); // Recalculate after removing an item
        fetchCartItemCount();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to remove item from cart.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchCartItems();
    }
  }, [userEmail]);

  if (loading) return <div>Loading cart items...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalPrice = totalProductPrice + shippingPrice;

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-center">Quantity</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.productId._id} className="border-b hover:bg-gray-50">
                <td className="flex items-center px-4 py-3">
                  <img
                    src={`http://localhost:5001/uploads/${item.productId.image}`}
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover mr-4 rounded-md border"
                  />
                  <div>
                    <p className="font-medium text-gray-700">{item.productId.name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                </td>
                <td className="text-center px-4 py-3">{item.quantity}</td>
                <td className="text-right px-4 py-3">${item.productId.price * item.quantity}</td>
                <td className="text-center px-4 py-3">
                  <button
                    onClick={() => handleRemoveItem(item.productId._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cartItems.length === 0 && (
          <p className="text-center text-gray-500 py-6">Your cart is empty.</p>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-700">Summary</p>
          <div className="flex justify-between mt-2 text-gray-600">
            <p>Total Product Price:</p>
            <p>${totalProductPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mt-2 text-gray-600">
            <p>Shipping Price:</p>
            <p>${shippingPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mt-2 text-gray-800 font-bold">
            <p>Total Price:</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
      <Link to='/place-order'>  <button
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
           
          >
            Proceed to Checkout
          </button></Link>  
        </div>
      )}
    </div>
  );
};

export default Usercarts;
