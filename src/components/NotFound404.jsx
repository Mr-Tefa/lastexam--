import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleAlt, faGlassWhiskey, faBoxOpen, faHeart } from "@fortawesome/free-solid-svg-icons";

export default function NotFound404() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-10 px-2">
      <div className="text-[7rem] font-extrabold text-green-100 leading-none select-none">404</div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 mt-2">Oops! Page Not Found</h1>
      <p className="text-gray-500 mb-6 text-center max-w-md">The page you're looking for seems to have gone shopping!<br/>Don't worry, our fresh products are still available for you.</p>
      <div className="flex gap-3 mb-8">
        <a href="/" className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition">Back to Home</a>
        <a href="/SearchProducts" className="border-2 border-green-600 text-green-600 px-6 py-2 rounded font-semibold hover:bg-green-50 transition">Search Products</a>
      </div>
      <div className="mb-8 w-full max-w-2xl">
        <div className="text-gray-600 font-semibold mb-3">Or explore our popular categories</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg border p-4 flex flex-col items-center shadow-sm">
            <FontAwesomeIcon icon={faAppleAlt} className="text-green-500 text-2xl mb-2" />
            <div className="font-bold text-sm">Fruits & Vegetables</div>
          </div>
          <div className="bg-white rounded-lg border p-4 flex flex-col items-center shadow-sm">
            <FontAwesomeIcon icon={faGlassWhiskey} className="text-blue-400 text-2xl mb-2" />
            <div className="font-bold text-sm">Dairy & Eggs</div>
          </div>
          <div className="bg-white rounded-lg border p-4 flex flex-col items-center shadow-sm">
            <FontAwesomeIcon icon={faBoxOpen} className="text-yellow-500 text-2xl mb-2" />
            <div className="font-bold text-sm">Bakery & Snacks</div>
          </div>
          <div className="bg-white rounded-lg border p-4 flex flex-col items-center shadow-sm">
            <FontAwesomeIcon icon={faHeart} className="text-red-400 text-2xl mb-2" />
            <div className="font-bold text-sm">Meat & Seafood</div>
          </div>
        </div>
      </div>
      <div className="bg-green-50 rounded-lg p-4 mb-8 w-full max-w-2xl flex flex-col md:flex-row items-center md:items-start gap-4">
        <div className="flex-1">
          <div className="font-bold text-green-800 mb-1">Need Help?</div>
          <div className="text-gray-700 text-sm mb-1">Our customer support team is here to assist you 24/7</div>
          <div className="text-green-700 font-bold text-base">+1 (800) 123-4567 <span className="text-gray-500 font-normal ml-2">support@freshcart.com</span> <span className="ml-2 underline cursor-pointer">Live Chat</span></div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl flex flex-col md:flex-row items-center gap-3 border">
        <div className="flex-1 font-semibold text-gray-700">Subscribe to our Newsletter</div>
        <form className="flex gap-2 w-full md:w-auto">
          <input type="email" placeholder="Your email address" className="border rounded px-3 py-2 flex-1 md:w-64" />
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition">Subscribe</button>
        </form>
      </div>
    </div>
  );
} 