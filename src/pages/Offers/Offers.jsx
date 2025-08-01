import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { NavLink } from "react-router-dom";
import { apiRequest } from "../../api";
import { useCart } from "../../context/CartContext";
import LoadingCart from "../../components/LoadingCart";

export default function Offers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(60 * 60 * 24); // 24 hours
  const { addToCart, addToWishlist } = useCart();

  useEffect(() => {
    getOffers();
  }, []);

  const getOffers = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/products");
      const deals = (data.data || []).filter(p => p.priceAfterDiscount);
      setProducts(deals);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const hours = String(Math.floor(timer / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timer % 3600) / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');

  if (loading) return <LoadingCart />;

  return (
    <main className="bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <section className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Special Offers & Deals</h1>
          <p className="text-lg text-green-100 mb-6">Limited time offers on selected products</p>
          <div className="flex items-center justify-center gap-4 text-xl font-bold">
            <span>Offers end in:</span>
            <span className="bg-white text-green-600 rounded px-3 py-1">{hours}</span>:
            <span className="bg-white text-green-600 rounded px-3 py-1">{minutes}</span>:
            <span className="bg-white text-green-600 rounded px-3 py-1">{seconds}</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow p-3 flex flex-col relative group hover:shadow-lg transition">
              {/* Wishlist Icon */}
              <button 
                onClick={() => addToWishlist(product)}
                className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition z-10"
              >
                <FontAwesomeIcon icon={faHeartRegular} />
              </button>
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                -{Math.round(100 - (product.priceAfterDiscount / product.price) * 100)}%
              </div>
              <NavLink to={`/Product/${product._id}`}>
                <img src={product.imageCover} alt={product.title} className="w-full h-36 object-contain mb-2" />
              </NavLink>
              <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
              <NavLink to={`/Product/${product._id}`} className="font-semibold text-sm mb-1 line-clamp-2 min-h-[36px] hover:text-green-600 transition">
                {product.title}
              </NavLink>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400"><FontAwesomeIcon icon={faStar} /></span>
                <span className="text-xs font-bold text-gray-700">{product.ratingsAverage}</span>
                <span className="text-xs text-gray-400">({product.ratingsQuantity})</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-green-700 text-base">{product.priceAfterDiscount} EGP</span>
                <span className="line-through text-gray-400 text-xs">{product.price} EGP</span>
              </div>
              <button 
                onClick={() => addToCart(product)}
                className="mt-auto bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center self-end hover:bg-green-700 transition"
              >
                <FontAwesomeIcon icon={faCartPlus} />
              </button>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No Offers Available</h2>
            <p className="text-gray-500 mb-6">Check back later for amazing deals!</p>
            <NavLink to="/" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
              Back to Home
            </NavLink>
          </div>
        )}
      </section>
    </main>
  );
}