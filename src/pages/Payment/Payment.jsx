import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // حساب الإجمالي
  const subtotal = cart.reduce((sum, p) => sum + p.price, 0);
  const shipping = 30;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax;

  function handleCardChange(field, value) {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
      if (formattedValue.length > 0) {
        formattedValue = formattedValue.match(/.{1,4}/g).join(' ');
      }
    } else if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // محاكاة نجاح الدفع
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Payment successful! Your order has been placed.");
      navigate('/Orders');
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!cart || cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-gray-300 text-7xl mb-4">💳</div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty!</h1>
          <p className="text-gray-500 mb-6">Add some products to your cart before proceeding to payment.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-green-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/Checkout')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <span>←</span>
            Back to Checkout
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h1>
          <p className="text-gray-600">Complete your order with secure payment methods</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>

              <form onSubmit={handleSubmit}>
                {/* Payment Method Selection */}
                <div className="space-y-4 mb-6">
                  {/* Cash on Delivery Option */}
                  <label className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when your order arrives</div>
                    </div>
                    <span className="text-green-600 font-bold text-xs">No extra charges</span>
                  </label>

                  {/* Credit Card Option */}
                  <label className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'card' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                      <div className="text-sm text-gray-500">Pay securely with your card</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-6" />
                    </div>
                  </label>

                  {/* PayPal Option */}
                  <label className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'paypal' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">PayPal</div>
                      <div className="text-sm text-gray-500">Pay with your PayPal account</div>
                    </div>
                    <span className="text-blue-600 text-xl font-bold">PayPal</span>
                  </label>
                </div>

                {/* Card Details Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={cardDetails.number}
                        onChange={(e) => handleCardChange('number', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Name on Card */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        placeholder="Name on Card"
                        value={cardDetails.name}
                        onChange={(e) => handleCardChange('name', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expire Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => handleCardChange('expiry', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV Code
                        </label>
                        <input
                          type="text"
                          placeholder="XXX"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardChange('cvv', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Message */}
                {paymentMethod === "paypal" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700">
                      <span className="font-medium">PayPal</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                      You will be redirected to PayPal website to complete your order securely.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors mt-6 ${
                    !isLoading
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    paymentMethod === 'cod' ? 'Place Order (Cash on Delivery)' : 'Place Order'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cart.map((product, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={product.imageCover} alt={product.title} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{product.title}</div>
                      <div className="text-xs text-gray-500">Qty: 1</div>
                    </div>
                    <div className="font-bold text-green-600">{product.price} EGP</div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{subtotal.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>{shipping.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span>{tax.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">{total.toFixed(2)} EGP</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <span>🔒</span>
                  <span className="font-medium text-sm">Secure Payment</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 