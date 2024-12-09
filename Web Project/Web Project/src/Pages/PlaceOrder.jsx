import React, { useContext, useState ,useEffect} from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import CartTotal from '../Components/CartTotal';
import Title from '../Components/Title';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';

const STRIPE_PUBLISHABLE_KEY = "pk_test_51QOpTACKRhyXOJRYBFqxtnQ2Nw1UPduX3BnSFWoG6IMAVysqaVs0j23z076QzR6KrnhlVb2weUtH3oF4NLBt6lJR00Xs9AZAoD";

const PlaceOrder = () => {
  // ... (keep existing state and other functions)


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const navigate =useNavigate();
  const {  getCartAmount,userEmail } = useContext(ShopContext);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(''); // Added state for payment method
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Manage success state
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
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => setStripeLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
   
  }, []);

  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => navigate('/orders'), 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [paymentSuccess, navigate]);


  const totalAmount = totalProductPrice+delivery_fee;
  const handleStripePayment = async () => {
    if (!stripeLoaded) {
      alert('Stripe is not loaded yet. Please try again in a moment.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/payment_route/payment', {
        amount: Math.round(totalAmount * 100), 
        productName: 'Your Product Name'
      });
      const sessionId = response.data.id;
      const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe Checkout Error:', error);
        alert('Payment initiation failed.');
      } else {
        setPaymentSuccess(true);
         alert('Your Payment hase been done')
         navigate('/orders')
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Payment initiation failed.');
    }
  };

  if (paymentSuccess) {
    return <h1>Your Payment was Successful! Redirecting to orders...</h1>;
  }
  const sendEmail = async () => {
    try {
        const response = await axios.post('http://localhost:5001/api/email', {
            email: 'i221533@nu.edu.pk', // Customer email
            name: 'John Doe',             // Customer name
            orderId: 'ORD12345',          // Example Order ID
            total: 250.75,                // Example total amount
        });

        console.log(response.data);
        alert('Order confirmation email sent successfully!');
    } catch (error) {
        console.error('Failed to send email:', error.response || error);
        alert('Failed to send email.');
    }
};
  
  const handlePlaceOrder = () => {
    if (paymentMethod === 'stripe') {
      sendEmail();
     // handleStripePayment();
     
    } else if (paymentMethod === 'cod') {
      navigate('/orders');
    } else if (paymentMethod === 'razorpay') {
      alert('Razorpay payment not implemented yet');
    } else {
      alert('Please select a payment method');
    }
  };

  console.log('Total Amount:', totalAmount);



  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* --------------- Left Side ----------------------- */}

      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
  <div className="text-xl sm:text-2xl my-3">
    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
  </div>
  <div className="flex flex-col sm:flex-row gap-3">
    <input
      type="text"
      name="firstName"
      value={formData.firstName}
      onChange={handleInputChange}
      placeholder="First Name"
      className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    />
    <input
      type="text"
      name="lastName"
      value={formData.lastName}
      onChange={handleInputChange}
      placeholder="Last Name"
      className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    />
  </div>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleInputChange}
    placeholder="Email Address"
    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
  />
  <input
    type="text"
    name="street"
    value={formData.street}
    onChange={handleInputChange}
    placeholder="Street"
    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
  />
  <div className="flex flex-col sm:flex-row gap-3">
    <input
      type="text"
      name="city"
      value={formData.city}
      onChange={handleInputChange}
      placeholder="City"
      className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    />
    <input
      type="text"
      name="state"
      value={formData.state}
      onChange={handleInputChange}
      placeholder="State"
      className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    />
  </div>
  <div className="flex flex-col sm:flex-row gap-3">
    <input
      type="text"
      name="zipcode"
      value={formData.zipcode}
      onChange={handleInputChange}
      placeholder="Zipcode"
      className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    />
    <input
      type="text"
      name="country"
      value={formData.country}
      onChange={handleInputChange}
      placeholder="Country"
      className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
    />
  </div>
  <input
    type="number"
    name="phone"
    value={formData.phone}
    onChange={handleInputChange}
    placeholder="Phone"
    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
  />
</div>


      {/* --------------- Right Side ----------------------- */}

      <div className="mt-8">
        <div className="mt8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          {/* -------------- Payment method selection -------------- */}

          <div className="flex flex-col lg:flex-row gap-4">
            <div
              onClick={() => {
                setPaymentMethod('stripe');
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === 'stripe' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className="h5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => {
                setPaymentMethod('razorpay');
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === 'razorpay' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className="h5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div
              onClick={() => {
                setPaymentMethod('cod');
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === 'cod' ? 'bg-green-400' : ''
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                {' '}
                CASH ON DELIVARY
              </p>
            </div>
          </div>

          {/* -------------- Payment method selection -------------- */}
          <div className="w-full text-end mt-8">
  <button
    onClick={handlePlaceOrder} // Update this line to use the handlePlaceOrder function
    className="bg-black text-white px-16 py-3 text-sm"
  >
    PLACE ORDER
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;



