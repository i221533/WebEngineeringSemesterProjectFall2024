import PropTypes from 'prop-types';
import { createContext, useState ,useEffect} from 'react';
import { products } from '../assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = '$';
  const delivery_fee = 10;

  const [search, setSearch] = useState('');
  const [userEmail, setuserEmail] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [orders, setOrders] = useState([]); // New state to hold orders
  const navigate = useNavigate(); 

  const fetchCartItemCount = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/cart/cartitems/${userEmail}`);
      const data = await response.json();

      if (response.ok) {
        setCartItems(data.totalItems);
      } 
    } catch (err) {
      
    } 
  };
  useEffect(() => {
    if (userEmail) {
      fetchCartItemCount();
      alert(cartItems)
    }
  });

  const addToCart = async (productId, size) => {
    if (!size) {
      alert('Please select a size before adding to the cart.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5001/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, productId, quantity: 1, size }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchCartItemCount();
      } else {
        alert(data.message || 'Failed to add product to cart.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };
  const addOrder = () => {
    let tempOrders = structuredClone(orders);
    let newOrder = [];

    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          newOrder.push({
            _id: item,
            size,
            quantity: cartItems[item][size],
          });
        }
      }
    }
    setOrders([...tempOrders, ...newOrder]);
    //setCartItems({}); // Clear cart after placing the order
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          totalCount += cartItems[item][size];
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const productInfo = products.find((product) => product._id === item);
      for (const size in cartItems[item]) {
        try {
          if (cartItems[item][size] > 0) {
            totalAmount += productInfo.price * cartItems[item][size];
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    }
    return totalAmount;
  };

  const value = {
    products,
    currency,
    delivery_fee,
    userEmail,
    setuserEmail,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    addOrder, // Add this to allow placing orders
    orders,
    navigate,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ShopContextProvider;
