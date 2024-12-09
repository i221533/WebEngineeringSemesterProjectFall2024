
// import { Route, Routes, useLocation } from 'react-router-dom';
// import './App.css';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Import Pages
// import Home from './pages/Home';
// import Collection from './pages/Collection';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Product from './pages/Product';
// import Cart from './pages/Cart';
// import Login from './pages/Login';
// import PlaceOrder from './pages/PlaceOrder';
// import Orders from './pages/Orders';
// import Dashboard from './pages/Dashboard';
// import ProductManagement from './pages/ProductManagement';
// import OrderManagement from './pages/OrderManagement';
// import CustomerManagement from './pages/CustomerManagement';
// import SellerDashboard from './pages/SellerDashboard';
// import SellerOrderManagement from './pages/SellerOrderManagement';
// import SellerProductManagement from './pages/SellerProductManagement';
// import SellerInventoryManagement from './pages/SellerInventoryManagement';
// import SellerSalesReports from './pages/SellerSalesReports';
// import ChatBot from './Components/ChatBox';

// // Import Components
// import Navbar from './components/Navbar';
// import SellerNavbar from './components/SellerNavbar';
// import AdminNavbar from './components/AdminNavbar';
// import Footer from './components/Footer';
// import SearchBar from './components/SearchBar';

// function App() {
//   const location = useLocation();

//   // Determine Navbar rendering logic
//   const isAdminRoute =
//     location.pathname.includes('/dashboard') || 
//     location.pathname.includes('/products-mng') || 
//     location.pathname.includes('/orders-mng') || 
//     location.pathname.includes('/customer-mng');

//   const isSellerRoute = location.pathname.includes('/seller');

//   return (
//     <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
//       {/* React Toast Notifications */}
//       <ToastContainer />

//       {/* Navbar Rendering */}
//       {isAdminRoute ? (
//         <AdminNavbar />
//       ) : isSellerRoute ? (
//         <SellerNavbar />
//       ) : (
//         <Navbar />
//       )}

//       {/* Search Bar */}
//       <SearchBar />

//       {/* App Routes */}
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/collection" element={<Collection />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/product/:productId" element={<Product />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/place-order" element={<PlaceOrder />} />
//         <Route path="/orders" element={<Orders />} />

//         {/* Admin Panel Routes */}
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/products-mng" element={<ProductManagement />} />
//         <Route path="/orders-mng" element={<OrderManagement />} />
//         <Route path="/customer-mng" element={<CustomerManagement />} />

//         {/* Seller Panel Routes */}
//         <Route path="/seller-dashboard" element={<SellerDashboard />} />
//         <Route path="/seller-orders" element={<SellerOrderManagement />} />
//         <Route path="/seller-products" element={<SellerProductManagement />} />
//         <Route path="/seller-inventory" element={<SellerInventoryManagement />} />
//         <Route path="/seller-sales-reports" element={<SellerSalesReports />} />

//         <Route path="/addproduct" element={<AddProduct/>} />
//         <Route path="/allproduct" element={<ProductGallery/>} />
//       </Routes>

//       {/* Footer */}
//       <Footer />

//       {/* ChatBot */}
//       <ChatBot />
//     </div>
//   );
// }

// export default App;





import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './Pages/Orders';
import Dashboard from './Pages/Dashboard';
import ProductManagement from './Pages/ProductManagement'
import OrderManagement from './Pages/OrderManagement';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import SearchBar from './Components/SearchBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomerManagement from './Pages/CustomerManagement';
import AddProduct from './Pages/AddProduct';
import ProductGallery from './Pages/ProductGallery';
import Usercarts from './Pages/Usercarts';
import ChatBot from './Components/ChatBox';

function App() {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />

      <Navbar />
      <SearchBar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Usercarts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />

        {/* Admin Panel Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/addproduct" element={<AddProduct/>} />
        <Route path="/allproduct" element={<ProductGallery/>} />
      </Routes>

      <Footer />
      {/* <ChatBot/> */}
    </div>
  );
}

export default App;