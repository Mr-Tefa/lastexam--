import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCartPlus, faStar, faHeartBroken, faCheckCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import NotFound404 from "../../components/NotFound404";

export default function Favourties() {
  const { wishlist, setWishlist, addToCart, addToWishlist } = useCart();
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [wishlistName, setWishlistName] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [myWishlists, setMyWishlists] = useState([
    { name: "Default Wishlist", count: wishlist.length },
    { name: "Birthday Ideas", count: 8 },
    { name: "Weekly Groceries", count: 15 },
  ]);
  const [suggested, setSuggested] = useState([]);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("https://ecommerce.routemisr.com/api/v1/products?recentlyViewed=true")
      .then(res => res.json())
      .then(data => setRecentlyViewed(data.data || []));
    fetch("https://ecommerce.routemisr.com/api/v1/products?limit=6")
      .then(res => res.json())
      .then(data => setSuggested(data.data || []));
  }, []);

  // حذف منتج من المفضلة
  const handleRemove = (idx) => {
    setWishlist(wishlist.filter((_, i) => i !== idx));
    setMessage("Removed from wishlist!");
    setTimeout(() => setMessage(""), 1500);
  };

  // حذف الكل
  const handleClearAll = () => {
    setWishlist([]);
    setMessage("Wishlist cleared!");
    setTimeout(() => setMessage(""), 1500);
  };

  // إضافة الكل للسلة
  const handleAddAllToCart = () => {
    wishlist.forEach(product => addToCart(product));
    setMessage("All items added to cart!");
    setTimeout(() => setMessage(""), 1500);
  };

  // إضافة للسلة مع رسالة
  const handleAddToCart = (product) => {
    addToCart(product);
    setMessage("Added to cart!");
    setTimeout(() => setMessage(""), 1500);
  };

  // إنشاء قائمة مفضلة جديدة (شكلي فقط)
  const handleCreateWishlist = (e) => {
    e.preventDefault();
    setMyWishlists(prev => [...prev, { name: wishlistName, count: 0 }]);
    setWishlistName("");
  };

  // Pagination
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);
  const paginatedWishlist = wishlist.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <main className="container mx-auto px-4 py-8">
      {message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-100 text-green-800 px-6 py-2 rounded-full shadow-lg font-semibold text-base animate-fade-in">
          <FontAwesomeIcon icon={faCheckCircle} /> {message}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        {/* القائمة الرئيسية */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              My Wishlist <span className="text-base font-normal text-gray-500">({wishlist.length} items)</span>
            </h1>
            {wishlist.length > 0 && (
              <div className="flex gap-2">
                <button onClick={handleClearAll} className="border px-4 py-1 rounded text-gray-600 hover:bg-gray-100 text-sm">Clear All</button>
                <button onClick={handleAddAllToCart} className="bg-green-600 text-white px-4 py-1 rounded text-sm font-semibold hover:bg-green-700 flex items-center gap-1"><FontAwesomeIcon icon={faCartPlus} /> Add All to Cart</button>
              </div>
            )}
          </div>
          {wishlist.length === 0 ? (
            <NotFound404 />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow">
              {paginatedWishlist.map((product, idx) => (
                <div key={idx} className={`flex items-center px-4 py-3 gap-4 ${idx !== paginatedWishlist.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition`}> 
                  <img src={product.imageCover} alt={product.title} className="w-16 h-16 object-contain rounded bg-gray-50 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
                    <div className="font-semibold text-base truncate">{product.title}</div>
                    <div className="flex items-center gap-2 text-yellow-500 text-xs mb-1">
                      <FontAwesomeIcon icon={faStar} />
                      <span className="font-bold text-gray-700">{product.ratingsAverage || 4.5}</span>
                      <span className="text-gray-400">({product.ratingsQuantity || 0})</span>
                    </div>
                  </div>
                  <div className="font-bold text-green-700 text-base min-w-[70px] text-right">{product.price} EGP</div>
                  <button onClick={() => handleAddToCart(product)} className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 flex items-center gap-1 ml-2 shadow"><FontAwesomeIcon icon={faCartPlus} /> Add to Cart</button>
                  <button onClick={() => handleRemove((page - 1) * itemsPerPage + idx)} className="ml-2 text-gray-400 hover:text-red-600 text-lg"><FontAwesomeIcon icon={faTrash} /></button>
                </div>
              ))}
            </div>
          )}
          {/* Pagination */}
          {wishlist.length > itemsPerPage && (
            <div className="flex justify-center mt-6 gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`border px-3 py-1 rounded ${page === i + 1 ? "bg-green-600 text-white" : ""}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
        {/* الشريط الجانبي */}
        <aside className="w-full md:w-80 flex flex-col gap-6">
          {/* Create New Wishlist */}
          <form onSubmit={handleCreateWishlist} className="bg-white rounded shadow p-4 mb-2 border border-gray-100">
            <h3 className="font-bold mb-2">Create New Wishlist</h3>
            <input type="text" value={wishlistName} onChange={e => setWishlistName(e.target.value)} placeholder="e.g., Holiday Shopping" className="border rounded px-3 py-2 w-full mb-2" />
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-1 text-sm">
                <input type="radio" checked={privacy === 'public'} onChange={() => setPrivacy('public')} /> Public
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input type="radio" checked={privacy === 'private'} onChange={() => setPrivacy('private')} /> Private
              </label>
            </div>
            <button type="submit" className="bg-green-600 text-white w-full py-2 rounded font-semibold hover:bg-green-700">Create Wishlist</button>
          </form>
          {/* My Wishlists */}
          <div className="bg-white rounded shadow p-4 border border-gray-100">
            <h3 className="font-bold mb-2">My Wishlists</h3>
            <ul className="space-y-2">
              {myWishlists.map((w, i) => (
                <li key={i} className="flex justify-between items-center text-sm">
                  <span>{w.name}</span>
                  <span className="text-gray-500">{w.count} items</span>
                  <button className="text-green-600 font-semibold ml-2">View</button>
                </li>
              ))}
            </ul>
          </div>
          {/* Share Your Wishlist */}
          <div className="bg-white rounded shadow p-4 border border-gray-100">
            <h3 className="font-bold mb-2">Share Your Wishlist</h3>
            <div className="flex gap-2 mb-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded font-semibold hover:bg-blue-700">Facebook</button>
              <button className="bg-blue-400 text-white px-3 py-1 rounded font-semibold hover:bg-blue-500">Twitter</button>
            </div>
            <div className="flex gap-2">
              <input type="text" value={window.location.href} readOnly className="border rounded px-2 py-1 flex-1 text-xs" />
              <button className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-green-700">Copy Link</button>
            </div>
          </div>
        </aside>
      </div>
      {/* Recently Viewed */}
      <section className="container mx-auto mt-12 mb-8">
        <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {recentlyViewed.map(product => (
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
              <button className="mt-auto bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center self-end hover:bg-green-700 transition" onClick={() => handleAddToCart(product)}><FontAwesomeIcon icon={faCartPlus} /></button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
