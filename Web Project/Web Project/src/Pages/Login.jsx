import React, { useState,useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../Context/ShopContext';
const Login = () => {
  const navigate = useNavigate();
  const { userEmail,setuserEmail} = useContext(ShopContext)
  const [currentState, setCurrentState] = useState('Login');
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    try {
      if (currentState === 'Sign Up') {
        // Registration logic
        const response = await axios.post('http://localhost:5001/api/auth/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role
        });

        // Save token and user info to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set token in axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        toast.success('Registration successful!');
        navigate('/home'); // Navigate to home page after registration
      } else {
        // Login logic
        const response = await axios.post('http://localhost:5001/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        // Save token and user info to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set token in axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        toast.success('Login successful!');
       // var useremail1=formData.email;
        setuserEmail(formData.email);
        alert(formData.email)
        alert(userEmail)
    console.log(userEmail);
        navigate('/home'); // Navigate to home page after login
      }
    } catch (error) {
      console.error('Authentication error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
  };
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <div className="w-full px-3 py-2 flex flex-col gap-4">
        {currentState === 'Sign Up' && (
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300"
            placeholder="Name"
            required
          />
        )}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300"
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300"
          placeholder="Password"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300"
          required
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
        </select>

        <div className="w-full flex justify-between text-sm mt-2">
          <p className="cursor-pointer">Forgot your password?</p>
          {currentState === 'Login' ? (
            <p
              onClick={() => setCurrentState('Sign Up')}
              className="cursor-pointer"
            >
              Create Account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState('Login')}
              className="cursor-pointer"
            >
              Login Here
            </p>
          )}
        </div>
        <button className="w-1/2 m-auto bg-black text-white px-8 py-2 mt-4">
          {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};

export default Login;