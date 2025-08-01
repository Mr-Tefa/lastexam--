import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="container mx-auto px-4 pt-12 pb-8 flex-1 flex flex-col items-center">
        {/* 404 */}
        <div className="text-[8rem] md:text-[10rem] font-extrabold text-green-100 mb-2 select-none" style={{lineHeight:1}}>
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Oops! Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">The page you're looking for seems to have gone shopping!<br/>Don't worry, our fresh products are still available for you.</p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <NavLink to="/" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
            Back to Home
          </NavLink>
          <NavLink to="/SearchProducts" className="bg-white border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center">
            Search Products
          </NavLink>
        </div>
        <div className="mb-10">
          <div className="text-gray-500 mb-4 font-semibold">Or explore our popular categories</div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 w-36">
              <div className="text-3xl mb-2">🍏</div>
              <div className="font-medium text-gray-700 text-sm">Fruits & Vegetables</div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 w-36">
              <div className="text-3xl mb-2">🥛</div>
              <div className="font-medium text-gray-700 text-sm">Dairy & Eggs</div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 w-36">
              <div className="text-3xl mb-2">🍞</div>
              <div className="font-medium text-gray-700 text-sm">Bakery & Snacks</div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 w-36">
              <div className="text-3xl mb-2">🥩</div>
              <div className="font-medium text-gray-700 text-sm">Meat & Seafood</div>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-6 mb-8 w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="font-bold text-gray-700 mb-1">Need Help?</div>
            <div className="text-gray-600 text-sm">Our customer support team is here to assist you 24/7</div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-3 md:mt-0">
            <a href="tel:+18001234567" className="text-green-700 font-semibold hover:underline text-sm">+1 (800) 123-4567</a>
            <a href="mailto:support@freshcart.com" className="text-green-700 font-semibold hover:underline text-sm">support@freshcart.com</a>
            <span className="text-green-700 font-semibold text-sm">Live Chat</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-2xl mx-auto mb-8">
          <div className="font-bold text-gray-700 mb-2">Subscribe to our Newsletter</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="Your email address" className="border border-gray-300 rounded-lg px-4 py-3 flex-1 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-green-700 transition-colors">Subscribe</button>
          </div>
        </div>
      </div>
      <footer className="bg-gray-50 border-t pt-8 pb-4 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-2 md:mb-0 font-semibold">FreshCart</div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <span>Fruits & Vegetables</span>
            <span>Dairy & Eggs</span>
            <span>Bakery & Snacks</span>
            <span>Meat & Seafood</span>
            <span>Beverages</span>
          </div>
          <div className="mt-2 md:mt-0">© 2023 FreshCart. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
