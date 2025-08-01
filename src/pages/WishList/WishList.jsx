import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faStar, faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

const PRODUCTS_API = "https://ecommerce.routemisr.com/api/v1/products";

export default function Favourties() {
  const { wishlist, cart, addToCart, addToWishlist, setWishlist } = useCart();

  // حالة الكميات لكل منتج في الـ wishlist
  const [quantities, setQuantities] = useState({});

  // عند تغيير الـ wishlist، أضبط الكميات الافتراضية (1)
  useEffect(() => {
    const initial = {};
    wishlist.forEach((product) => {
      initial[product._id] = quantities[product._id] || 1;
    });
    setQuantities(initial);
    // eslint-disable-next-line
  }, [wishlist]);

  const handleIncrease = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };
  const handleDecrease = (id) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      if (current <= 1) {
        // حذف المنتج من الـ wishlist
        setWishlist((old) => old.filter((item) => item._id !== id));
        // حذف الكمية من state
        const newQuantities = { ...prev };
        delete newQuantities[id];
        return newQuantities;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  // Pagination للـ wishlist
  const ITEMS_PER_PAGE = 3;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
  const paginatedWishlist = wishlist.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // في الأعلى:
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  useEffect(() => {
    try {
      let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      // إذا لم يوجد أي منتج في recentlyViewed، استخدم أول 5 منتجات من الـ wishlist
      if (viewed.length === 0 && wishlist.length > 0) {
        viewed = wishlist.slice(0, 5);
      }
      setRecentlyViewed(viewed);
    } catch {
      setRecentlyViewed(wishlist.slice(0, 5));
    }
  }, [wishlist]);

  return (
    <>
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Wishlist Section */}
        <section className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">My Wishlist</h1>
          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No items in your wishlist.</h2>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {paginatedWishlist.map((product, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow flex items-center p-4 gap-4 max-w-2xl">
                  <img src={product.imageCover} alt={product.title} className="w-20 h-20 object-contain rounded-lg bg-gray-50" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-lg mb-1 truncate">{product.title}</span>
                    <span className="text-green-700 font-bold text-base mb-1">{product.price} EGP</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <span className="text-yellow-400"><FontAwesomeIcon icon={faStar} /></span>
                      <span className="font-bold text-gray-700">{product.ratingsAverage}</span>
                      <span>({product.ratingsQuantity})</span>
                    </div>
                    <span className="text-xs text-gray-400">{product.category?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mr-2">
                    <button className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition text-xl font-bold" onClick={() => handleDecrease(product._id)}>-</button>
                    <span className="font-bold w-6 text-center">{quantities[product._id] || 1}</span>
                    <button className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition text-xl font-bold" onClick={() => handleIncrease(product._id)}>+</button>
                    <button className="text-gray-400 hover:text-green-600 transition text-2xl" title="Add to Cart" onClick={() => addToCart(product)}>
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                  </div>
                  <button className="bg-green-600 text-white rounded px-4 py-2 font-semibold hover:bg-green-700 transition" onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              ))}
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`border px-3 py-1 rounded ${page === i + 1 ? "bg-green-600 text-white" : ""}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
        {/* Sidebar Section */}
        <aside className="w-full lg:w-96 flex flex-col gap-6">
          {/* Create New Wishlist */}
          <div className="bg-white rounded-xl shadow p-6 mb-2">
            <h2 className="font-bold text-lg mb-2">Create New Wishlist</h2>
            <input type="text" placeholder="e.g., Holiday Shopping" className="border rounded px-3 py-2 w-full mb-3" />
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="privacy" /> Public
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="privacy" defaultChecked /> Private
              </label>
            </div>
            <button className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700">Create Wishlist</button>
          </div>
          {/* My Wishlists */}
          <div className="bg-white rounded-xl shadow p-6 mb-2">
            <h2 className="font-bold text-lg mb-2">My Wishlists</h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm"><span>Default Wishlist</span><span className="text-green-600 cursor-pointer">View</span></div>
              <div className="flex justify-between items-center text-sm"><span>Birthday Ideas</span><span className="text-green-600 cursor-pointer">View</span></div>
              <div className="flex justify-between items-center text-sm"><span>Weekly Groceries</span><span className="text-green-600 cursor-pointer">View</span></div>
            </div>
          </div>
          {/* Share Your Wishlist */}
          <div className="bg-white rounded-xl shadow p-6 mb-2">
            <h2 className="font-bold text-lg mb-2">Share Your Wishlist</h2>
            <div className="flex gap-2 mb-2">
              <button className="bg-blue-600 text-white px-4 py-1 rounded">Facebook</button>
              <button className="bg-blue-400 text-white px-4 py-1 rounded">Twitter</button>
            </div>
            <div className="flex gap-2">
              <input type="text" value="https://freshcart.com/wishlist" readOnly className="border rounded px-2 py-1 flex-1 text-xs" />
              <button className="bg-gray-200 px-2 py-1 rounded text-xs">Copy Link</button>
            </div>
          </div>
        </aside>
      </main>
      {/* Recently Viewed خارج الـ main */}
      <section className="container mx-auto mt-16 mb-8">
        <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {recentlyViewed.length === 0 && (
            <div className="col-span-full text-center text-gray-400">No recently viewed products.</div>
          )}
          {recentlyViewed.slice(0, 5).map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow p-3 flex flex-col relative group hover:shadow-lg transition">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition z-10" onClick={() => addToWishlist(product)}>
                <FontAwesomeIcon icon={faHeartRegular} />
              </button>
              <img src={product.imageCover} alt={product.title} className="w-full h-32 object-contain mb-2" />
              <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
              <div className="font-semibold text-sm mb-1 line-clamp-2 min-h-[36px]">{product.title}</div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400"><FontAwesomeIcon icon={faStar} /></span>
                <span className="text-xs font-bold text-gray-700">{product.ratingsAverage}</span>
                <span className="text-xs text-gray-400">({product.ratingsQuantity})</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-green-700 text-base">{product.price} EGP</span>
                {product.priceAfterDiscount && (
                  <span className="line-through text-gray-400 text-xs">{product.priceAfterDiscount} EGP</span>
                )}
              </div>
              <button className="mt-auto bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center self-end hover:bg-green-700 transition" onClick={() => addToCart(product)}>
                <FontAwesomeIcon icon={faCartPlus} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
