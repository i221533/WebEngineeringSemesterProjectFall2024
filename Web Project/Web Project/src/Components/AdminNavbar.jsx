import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useState } from 'react';

const AdminNavbar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/admin">
        <img src={assets.logo} alt="logo" className="w-48" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/dashboard" className="flex flex-col items-center gap-1">
          <p>DASHBOARD</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/orders-mng" className="flex flex-col items-center gap-1">
          <p>ORDER MANAGEMENT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/products-mng" className="flex flex-col items-center gap-1">
          <p>PRODUCTS MANAGEMENT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/customer-mng" className="flex flex-col items-center gap-1">
          <p>CUSTOMER MANAGEMENT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <div className="group relative">
          <Link to="/admin">
            <img
              src={assets.profile_icon}
              alt="profile"
              className="w-5 cursor-pointer"
            />
          </Link>
        </div>

        <img
          src={assets.menu_icon}
          alt="menu"
          className="w-5 cursor-pointer sm:hidden"
          onClick={() => setVisible(!visible)} // visibility toggle (true/false)
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white ease-in duration-300 ${visible ? 'w-full' : 'w-0'}`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} alt="back" className="h-4 rotate-180" />
            <p className="font-semibold">Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/admin/dashboard"
          >
            DASHBOARD
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/admin/orders"
          >
            ORDER MANAGEMENT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/admin/products"
          >
            PRODUCTS MANAGEMENT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/admin/customers"
          >
            CUSTOMER MANAGEMENT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
