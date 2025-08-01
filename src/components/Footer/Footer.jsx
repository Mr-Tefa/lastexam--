import React from "react";
import FreshCartLogo from "../../assets/Images/freshcart-logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram, faPinterest } from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 w-full">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center mb-4">
              <img src={FreshCartLogo} alt="FreshCart Logo" className="h-8 mr-2" />
            </div>
            <p className="text-gray-500 text-sm mb-4">
              FreshCart is a versatile e-commerce platform offering a wide range of products, from clothing to electronics. It provides a user-friendly experience for seamless shopping across diverse categories.
            </p>
            <div className="flex gap-4 mb-2">
              <a href="#" className="text-gray-400 hover:text-green-600">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600">
                <FontAwesomeIcon icon={faInstagram} />  
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600">
                <FontAwesomeIcon icon={faPinterest} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-600">
              <li><NavLink to="/Categories" className="hover:text-green-600">Men's Fashion</NavLink></li>
              <li><NavLink to="/Categories" className="hover:text-green-600">Women's Fashion</NavLink></li>
              <li><NavLink to="/Categories" className="hover:text-green-600">Baby & Toys</NavLink></li>
              <li><NavLink to="/Categories" className="hover:text-green-600">Beauty & Health</NavLink></li>
              <li><NavLink to="/Categories" className="hover:text-green-600">Electronics</NavLink></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600">
              <li><NavLink to="/NotFound" className="hover:text-green-600">About Us</NavLink></li>
              <li><NavLink to="/NotFound" className="hover:text-green-600">Contact Us</NavLink></li>
              <li><NavLink to="/NotFound" className="hover:text-green-600">Privacy Policy</NavLink></li>
              <li><NavLink to="/NotFound" className="hover:text-green-600">Terms of Service</NavLink></li>
              <li><NavLink to="/NotFound" className="hover:text-green-600">Shipping Policy</NavLink></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-600">
              <li><NavLink to="/Account" className="hover:text-green-600">My Account</NavLink></li>
              <li><NavLink to="/Orders" className="hover:text-green-600">My Orders</NavLink></li>
              <li><NavLink to="/WishList" className="hover:text-green-600">Wishlist</NavLink></li>
              <li><NavLink to="/NotFound" className="hover:text-green-600">Returns & Refunds</NavLink></li>
              <li><NavLink to="/NotFound" className="hover:text-green-600">Help Center</NavLink></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 w-full mt-4">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 flex justify-center">
          <p className="text-gray-500 text-sm text-center w-full">&copy; {new Date().getFullYear()} FreshCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

