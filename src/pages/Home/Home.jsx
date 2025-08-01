import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faStar, faArrowRight, faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import HomeImg from "../../assets/Images/home-slider-1.png";
import { faTruck, faRotateLeft, faCreditCard, faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import { apiRequest } from "../../api";
import { useCart } from "../../context/CartContext";
import LoadingCart from "../../components/LoadingCart";

export default function Home() {
  console.log('=== Home.jsx LOADED ===');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [timer, setTimer] = useState(60 * 60 * 24); // 24 ساعة افتراضي
  const [displayedProducts, setDisplayedProducts] = useState(10); // عدد المنتجات المعروضة
  const [showAllProducts, setShowAllProducts] = useState(false); // حالة عرض جميع المنتجات

  const navigate = useNavigate();
  const { addToCart, addToWishlist } = useCart();

  // جلب المنتجات والفئات
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const productsRes = await apiRequest("/products");
      setProducts(productsRes.data || []);
      setDeals((productsRes.data || []).filter(p => p.priceAfterDiscount));
      const categoriesRes = await apiRequest("/categories");
      setCategories(categoriesRes.data || []);
    } catch {
      setProducts([]);
      setDeals([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // عداد تنازلي للعروض
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);
  const hours = String(Math.floor(timer / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timer % 3600) / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');

  // دالة لعرض جميع المنتجات
  const handleViewAllProducts = () => {
    setShowAllProducts(true);
    setDisplayedProducts(products.length);
  };

  // دالة لإخفاء بعض المنتجات
  const handleShowLess = () => {
    setShowAllProducts(false);
    setDisplayedProducts(10);
  };

  if (loading) return <LoadingCart />;

  return (
    <>
      {console.log('Rendering Home')}
      <main className="bg-gray-50 min-h-screen w-full">
        {/* Banner */}
        <section className="w-full h-64 md:h-96 relative flex items-center justify-center mb-8 overflow-hidden">
          <img src={HomeImg} alt="Fresh Organic" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 w-full h-full bg-green-700 opacity-60 mix-blend-multiply"></div>
          <div className="relative z-10 text-white text-center w-full flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">Fresh Organic Produce Delivered to Your Door</h1>
            <p className="text-lg md:text-2xl text-green-100 mb-6 drop-shadow">Get 20% off on your first order with code <b>FRESH20</b></p>
            <div className="flex gap-4 justify-center">
              <NavLink to="/Search-products" className="bg-white text-green-600 font-bold px-6 py-2 rounded shadow hover:bg-green-50 transition">
                Shop Now
              </NavLink>
              <NavLink to="/Offers" className="bg-green-100 text-green-800 font-bold px-6 py-2 rounded shadow hover:bg-green-200 transition">
                View Deals
              </NavLink>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <FontAwesomeIcon icon={faTruck} className="text-green-600 text-3xl mb-2" />
            <span className="font-semibold">Free Delivery</span>
            <span className="text-xs text-gray-500">Orders $50 or more</span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <FontAwesomeIcon icon={faRotateLeft} className="text-green-600 text-3xl mb-2" />
            <span className="font-semibold">30 Days Return</span>
            <span className="text-xs text-gray-500">Satisfaction guaranteed</span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <FontAwesomeIcon icon={faCreditCard} className="text-green-600 text-3xl mb-2" />
            <span className="font-semibold">Secure Payment</span>
            <span className="text-xs text-gray-500">100% protected checkout</span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <FontAwesomeIcon icon={faPhoneVolume} className="text-green-600 text-3xl mb-2" />
            <span className="font-semibold">24/7 Support</span>
            <span className="text-xs text-gray-500">Ready to help anytime</span>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="container mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Shop by Category</h2>
            <NavLink to="/Categories" className="text-green-600 text-sm font-semibold flex items-center gap-1">
              View All Categories
              <FontAwesomeIcon icon={faArrowRight} />
            </NavLink>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.slice(0, 8).map(cat => (
              <NavLink key={cat._id} to={`/Search-products?category=${cat._id}`} className="bg-white rounded shadow p-4 flex flex-col items-center hover:shadow-lg transition-shadow">
                <img src={cat.image} alt={cat.name} className="w-16 h-16 object-contain mb-2 rounded-full border border-gray-200 bg-gray-50" />
                <span className="font-semibold text-center">{cat.name}</span>
              </NavLink>
            ))}
          </div>
        </section>

        {/* Deals of the Day */}
        <section className="container mx-auto px-2 md:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Deals of the Day</h2>
            <div className="flex items-center gap-2 text-green-700 font-bold">
              Offers end in:
              <span className="bg-gray-200 rounded px-2 py-1">{hours}</span>:
              <span className="bg-gray-200 rounded px-2 py-1">{minutes}</span>:
              <span className="bg-gray-200 rounded px-2 py-1">{seconds}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {deals.slice(0, 5).map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow p-3 flex flex-col relative group hover:shadow-lg transition">
                {/* Wishlist Icon */}
                <button 
                  onClick={() => addToWishlist(product)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition z-10"
                >
                  <FontAwesomeIcon icon={faHeartRegular} />
                </button>
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
                  <span className="font-bold text-green-700 text-base">{product.price} EGP</span>
                  {product.priceAfterDiscount && (
                    <>
                      <span className="line-through text-gray-400 text-xs">{product.priceAfterDiscount} EGP</span>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">-{Math.round(100 - (product.priceAfterDiscount / product.price) * 100)}%</span>
                    </>
                  )}
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
          <div className="flex justify-end mt-4">
            <NavLink to="/Offers" className="text-green-600 text-sm font-semibold flex items-center gap-1">
              View All Deals
              <FontAwesomeIcon icon={faArrowRight} />
            </NavLink>
          </div>
        </section>

        {/* Popular Products */}
        <section className="container mx-auto px-2 md:px-8 py-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Popular Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {products.slice(0, displayedProducts).map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow p-3 flex flex-col relative group hover:shadow-lg transition">
                <button 
                  onClick={() => addToWishlist(product)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition z-10"
                >
                  <FontAwesomeIcon icon={faHeartRegular} />
                </button>
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
                  <span className="font-bold text-green-700 text-base">{product.price} EGP</span>
                  {product.priceAfterDiscount && (
                    <>
                      <span className="line-through text-gray-400 text-xs">{product.priceAfterDiscount} EGP</span>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">-{Math.round(100 - (product.priceAfterDiscount / product.price) * 100)}%</span>
                    </>
                  )}
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
          <div className="flex justify-center mt-6">
            {!showAllProducts ? (
              <button 
                onClick={handleViewAllProducts}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
              >
                View All Products
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <button 
                onClick={handleShowLess}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center gap-2"
              >
                Show Less
                <FontAwesomeIcon icon={faArrowRight} className="rotate-180" />
              </button>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="w-full bg-green-50 py-10 flex flex-col items-center justify-center mb-0 px-2 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">Subscribe to our Newsletter</h2>
          <p className="mb-4 text-gray-600 text-base md:text-lg text-center">Stay updated with our latest offers, recipes, and health tips.</p>
          <form className="flex flex-col md:flex-row justify-center items-center gap-2 w-full max-w-xl">
            <input type="email" placeholder="Your email address" className="border rounded px-4 py-2 flex-1 min-w-[180px] md:min-w-[260px] text-base" />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-semibold text-base min-w-[120px]">Subscribe</button>
          </form>
        </section>
      </main>
    </>
  );
}
