import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCreditCard, faMoneyBillWave, faArrowLeft, faStar, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, addToCart, addToWishlist } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [billing, setBilling] = useState({
    sameAsDelivery: true,
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: ""
  });
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    fetch("https://ecommerce.routemisr.com/api/v1/products?limit=6")
      .then(res => res.json())
      .then(data => setSuggested(data.data || []));
  }, []);

  // حساب الإجمالي
  const subtotal = cart.reduce((sum, p) => sum + p.price, 0);
  const discount = subtotal > 0 ? 2.46 : 0;
  const delivery = subtotal > 0 ? 4.99 : 0;
  const tax = subtotal > 0 ? 0.98 : 0;
  const total = subtotal - discount + delivery + tax;

  return (
    <main className="bg-gray-50 min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Payment & Address */}
          <div className="md:col-span-2 flex flex-col gap-8">
            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow p-6 mb-4">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="flex flex-col gap-4">
                <label className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}> 
                  <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <span className="flex-1">
                    <span className="font-semibold">Cash on Delivery</span>
                    <span className="block text-xs text-gray-500">Pay when your order arrives</span>
                  </span>
                  <span className="text-green-600 font-bold text-xs">No extra charges</span>
                </label>
                {paymentMethod === 'cod' && (
                  <div className="bg-green-100 text-green-700 rounded-lg px-4 py-3 font-semibold flex items-center gap-2 mt-2">
                    <FontAwesomeIcon icon={faCheckCircle} /> Please keep exact change ready for hassle-free delivery
                  </div>
                )}
                <label className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer ${paymentMethod === 'online' ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}> 
                  <input type="radio" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                  <span className="flex-1">
                    <span className="font-semibold">Credit/Debit Card</span>
                    <span className="block text-xs text-gray-500">Pay securely with your card</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-6" />
                  </div>
                </label>
                {paymentMethod === 'online' && (
                  <div className="bg-blue-100 text-blue-700 rounded-lg px-4 py-3 font-semibold flex items-center gap-2 mt-2">
                    <FontAwesomeIcon icon={faCreditCard} /> You will be redirected to secure payment gateway to complete your transaction
                  </div>
                )}
                
                <label className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer ${paymentMethod === 'paypal' ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}> 
                  <input type="radio" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                  <span className="flex-1">
                    <span className="font-semibold">PayPal</span>
                    <span className="block text-xs text-gray-500">Pay with your PayPal account</span>
                  </span>
                  <span className="text-blue-600 font-bold text-lg">PayPal</span>
                </label>
                {paymentMethod === 'paypal' && (
                  <div className="bg-blue-100 text-blue-700 rounded-lg px-4 py-3 font-semibold flex items-center gap-2 mt-2">
                    <span>💳</span> You will be redirected to PayPal website to complete your order securely
                  </div>
                )}
              </div>
            </div>
            {/* Billing Address */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">📍</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Billing Address</h2>
              </div>
              
              <form className="space-y-6">
                {/* Same as Delivery Address */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="sameAsDelivery"
                    checked={billing.sameAsDelivery} 
                    onChange={e => setBilling(b => ({ ...b, sameAsDelivery: e.target.checked }))}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="sameAsDelivery" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Same as delivery address
                  </label>
                </div>

                {/* Address Fields */}
                <div className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="First Name" 
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" 
                        value={billing.firstName} 
                        onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="Last Name" 
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" 
                        value={billing.lastName} 
                        onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} 
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your full address" 
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" 
                      value={billing.address} 
                      onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} 
                    />
                  </div>

                  {/* City & ZIP Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input 
                        type="text" 
                        placeholder="City" 
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" 
                        value={billing.city} 
                        onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input 
                        type="text" 
                        placeholder="ZIP Code" 
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" 
                        value={billing.zip} 
                        onChange={e => setBilling(b => ({ ...b, zip: e.target.value }))} 
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <span className="text-sm">ℹ️</span>
                    <span className="font-medium text-sm">Billing Information</span>
                  </div>
                  <p className="text-xs text-blue-600">
                    This address will be used for billing purposes and tax calculations.
                  </p>
                </div>
              </form>
            </div>
          </div>
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <ul className="divide-y divide-gray-100 mb-4">
              {cart.map((product, idx) => (
                <li key={idx} className="flex items-center gap-3 py-2">
                  <img src={product.imageCover} alt={product.title} className="w-12 h-12 object-contain rounded" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{product.title}</div>
                    <div className="text-xs text-gray-500">Qty: 1</div>
                  </div>
                  <div className="font-bold text-green-700 text-base">{product.price} EGP</div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-gray-700 font-semibold">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Discount:</span>
              <span>-{discount.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between text-gray-700 font-semibold">
              <span>Delivery:</span>
              <span>{delivery.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between text-gray-700 font-semibold">
              <span>Tax:</span>
              <span>{tax.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Total:</span>
              <span className="text-green-600">{total.toFixed(2)} EGP</span>
            </div>
            <button
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition mt-2"
              onClick={() => navigate('/Payment')}
            >
              Proceed to Payment
            </button>
            <button
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition mt-2 flex items-center justify-center gap-2"
              onClick={() => navigate('/Cart')}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Return to Cart
            </button>
            <div className="text-xs text-gray-500 mt-2">Secure Checkout<br />Your payment information is secure</div>
            <div className="flex gap-2 mt-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-6" />
              <span className="text-blue-600 font-bold text-lg">PayPal</span>
            </div>
          </div>
        </div>
        {/* You Might Also Like */}
        <section className="container mx-auto mt-12 mb-8">
          <h2 className="text-xl font-bold mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {suggested.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow p-3 flex flex-col relative group hover:shadow-lg transition">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition z-10" onClick={() => addToWishlist(product)}>
                  <FontAwesomeIcon icon={faHeartRegular} />
                </button>
                <img src={product.imageCover} alt={product.title} className="w-full h-24 object-contain mb-2" />
                <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
                <div className="font-semibold text-xs mb-1 line-clamp-2 min-h-[28px]">{product.title}</div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-yellow-400"><FontAwesomeIcon icon={faStar} /></span>
                  <span className="text-xs font-bold text-gray-700">{product.ratingsAverage}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-green-700 text-sm">{product.price} EGP</span>
                </div>
                <button className="mt-auto bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center self-end hover:bg-green-700 transition" onClick={() => addToCart(product)}><FontAwesomeIcon icon={faCartPlus} /></button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
