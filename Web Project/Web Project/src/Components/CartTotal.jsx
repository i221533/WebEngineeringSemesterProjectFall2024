import { useContext,useEffect,useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { currency, getCartAmount,userEmail } = useContext(ShopContext);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
 var delivery_fee=10.0;
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

useEffect(()=>{
  fetchCartItems();
})
  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={'CART'} text2={'TOTAL'} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm ">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {' '}
            {currency} {totalProductPrice}.00
          </p>
        </div>
        <div className="flex justify-between">
          <p>Delivery Fee</p>
          <p>
            {' '}
            {currency}{' '}
            {delivery_fee}.00
          </p>
        </div>
        <div className="flex justify-between">
          <p>Total</p>
          <p>
            {' '}
            {currency}{' '}
            {totalProductPrice + delivery_fee}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
