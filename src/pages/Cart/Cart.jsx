import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faStar, faMinus, faPlus, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, setCart, addToCart, addToWishlist } = useCart();
  const navigate = useNavigate();
  // كمية لكل منتج (افتراضي 1)
  const [quantities, setQuantities] = useState(cart.map(() => 1));
  const [suggested, setSuggested] = useState([]);

  // Pagination للـ cart
  const CART_ITEMS_PER_PAGE = 5;
  const [cartPage, setCartPage] = useState(1);
  const cartTotalPages = Math.ceil(cart.length / CART_ITEMS_PER_PAGE);
  const paginatedCart = cart.slice((cartPage - 1) * CART_ITEMS_PER_PAGE, cartPage * CART_ITEMS_PER_PAGE);

  // مزامنة quantities مع cart دائماً
  useEffect(() => {
    setQuantities((prev) => {
      // إذا زاد عدد المنتجات في cart، أضف 1 كقيمة افتراضية
      if (cart.length > prev.length) {
        return [...prev, ...Array(cart.length - prev.length).fill(1)];
      }
      // إذا نقص عدد المنتجات، قلل الطول
      if (cart.length < prev.length) {
        return prev.slice(0, cart.length);
      }
      return prev;
    });
  }, [cart]);

  useEffect(() => {
    fetch("https://ecommerce.routemisr.com/api/v1/products?limit=6")
      .then(res => res.json())
      .then(data => setSuggested(data.data || []));
  }, []);

  // حذف منتج من السلة
  const handleRemove = (idx) => {
    setCart(cart.filter((_, i) => i !== idx));
    setQuantities(quantities.filter((_, i) => i !== idx));
  };

  // تغيير الكمية
  const handleQuantity = (idx, val) => {
    if (val === -1 && quantities[idx] === 1) {
      // حذف المنتج إذا الكمية 1
      setCart(cart.filter((_, i) => i !== idx));
      setQuantities(quantities.filter((_, i) => i !== idx));
    } else {
      setQuantities(quantities.map((q, i) => (i === idx ? Math.max(1, q + val) : q)));
    }
  };

  // حساب الإجمالي
  const subtotal = cart.reduce((sum, p, i) => sum + (p.price * quantities[i]), 0);
  const discount = 0; // يمكن إضافة خصم لاحقًا
  const tax = 0; // يمكن إضافة ضريبة لاحقًا
  const total = subtotal - discount + tax;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        {cart.length === 0 ? (
          <div className="text-center py-20 text-lg font-bold">Your cart is empty.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {paginatedCart.map((product, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow flex items-center p-4 gap-4">
                  <img src={product.imageCover} alt={product.title} className="w-20 h-20 object-contain rounded-lg bg-gray-50" />
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="font-semibold text-lg">{product.title}</span>
                    {product.category?.name && (
                      <span className="text-xs text-gray-500">{product.category.name}</span>
                    )}
                    <div className="flex items-center gap-1 text-yellow-500 text-xs">
                      <FontAwesomeIcon icon={faStar} />
                      <span className="font-bold text-gray-700">{product.ratingsAverage || 4.5}</span>
                      <span className="text-gray-400">({product.ratingsQuantity || 0})</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <div className="flex items-center border rounded-lg">
                      <button onClick={() => handleQuantity(idx, -1)} className="px-2 py-1 text-gray-600 hover:text-green-600"><FontAwesomeIcon icon={faMinus} /></button>
                      <span className="px-3 py-1 font-semibold">{quantities[idx]}</span>
                      <button onClick={() => handleQuantity(idx, 1)} className="px-2 py-1 text-gray-600 hover:text-green-600"><FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                    <div className="text-lg font-bold text-green-700">{product.price * quantities[idx]} EGP</div>
                    {product.priceBeforeDiscount && (
                      <div className="line-through text-sm text-gray-400">{product.priceBeforeDiscount} EGP</div>
                    )}
                    <button onClick={() => handleRemove(idx)} className="text-red-500 hover:text-red-700 mt-2"><FontAwesomeIcon icon={faTrash} /></button>
                  </div>
                </div>
              ))}
              {cartTotalPages > 1 && (
                <div className="flex justify-center mt-6 gap-1">
                  {Array.from({ length: cartTotalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCartPage(i + 1)}
                      className={`border px-3 py-1 rounded ${cartPage === i + 1 ? "bg-green-600 text-white" : ""}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 h-fit">
              <h3 className="text-xl font-bold mb-2">Order Summary</h3>
              <div className="flex justify-between text-gray-700 font-semibold">
                <span>Subtotal:</span>
                <span>{subtotal} EGP</span>
              </div>
              {/* يمكن إضافة خصم وكوبون هنا */}
              <div className="flex justify-between text-gray-700 font-semibold">
                <span>Tax:</span>
                <span>{tax} EGP</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-4">
                <span>Total:</span>
                <span className="text-green-600">{total} EGP</span>
              </div>
              <button
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition mt-2"
                onClick={() => navigate('/Checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
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
    </main>
  );
}
