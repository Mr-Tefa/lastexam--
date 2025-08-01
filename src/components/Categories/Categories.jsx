import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faAppleAlt, faCarrot, faCheese, faBreadSlice, faFish, faTint } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from 'react-router-dom';
import { apiRequest } from "../../api";

const subcategories = [
  { icon: faAppleAlt, name: 'Fruits & Vegetables', count: 86 },
  { icon: faCarrot, name: 'Dairy & Eggs', count: 63 },
  { icon: faCheese, name: 'Bakery & Snacks', count: 72 },
  { icon: faBreadSlice, name: 'Meat & Seafood', count: 54 },
  { icon: faFish, name: 'Beverages', count: 48 },
  { icon: faTint, name: 'Household', count: 39 },
];

const seasonal = [
  { name: 'Summer Fruits', count: 28, img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fall Harvest', count: 32, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
  { name: 'Holiday Baking', count: 24, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80' },
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/categories");
      setCategories(data.data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-lg font-bold">Loading...</div>;

  return (
    <main className="bg-white min-h-screen w-full">
      {/* Header & Breadcrumb */}
      <section className="w-full bg-green-50 py-8 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shop by Categories</h1>
          <p className="text-lg text-gray-600 mb-4">Browse our wide selection of fresh products by category</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-1">&gt;</span>
            <span className="text-green-700 font-semibold">Categories</span>
          </div>
        </div>
      </section>
      {/* Main Categories Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {categories.slice(0, 6).map((cat, i) => (
            <NavLink
              key={cat._id}
              to={`/Search-products?category=${cat._id}`}
              className="relative group rounded-xl overflow-hidden shadow-lg bg-white"
              style={{ minHeight: '180px' }}
            >
              {/* صورة التصنيف أو لون افتراضي */}
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-40 object-cover object-center"
                />
              ) : (
                <div className="w-full h-40 bg-green-100" />
              )}
              {/* تدرج خفيف فقط أسفل الصورة */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
              {/* محتوى الكرت */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 z-20">
                <h3 className="text-white text-lg font-bold drop-shadow mb-1">{cat.name}</h3>
                <div className="flex gap-2 flex-wrap mb-1">
                  {cat.tags?.[0] && <span className="bg-white/90 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">{cat.tags[0]}</span>}
                  {cat.tags?.[1] && <span className="bg-white/90 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">{cat.tags[1]}</span>}
                </div>
                <span className="text-white text-xs drop-shadow">{cat.productsCount || 0} items</span>
              </div>
              {/* سهم صغير وشفاف */}
              <span className="absolute right-3 bottom-3 bg-white/80 text-green-600 rounded-full p-1.5 shadow flex items-center justify-center z-30 border border-white/60">
                <FontAwesomeIcon icon={faArrowRight} size="sm" />
              </span>
            </NavLink>
          ))}
        </div>
        {/* Popular Subcategories */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Popular Subcategories</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {subcategories.map((sub, i) => (
              <div key={i} className="bg-green-50 rounded-xl p-4 flex flex-col items-center hover:bg-green-100 transition">
                <span className="text-green-600 text-3xl mb-2"><FontAwesomeIcon icon={sub.icon} /></span>
                <span className="font-semibold text-center">{sub.name}</span>
                <span className="text-xs text-gray-500">{sub.count} items</span>
              </div>
            ))}
          </div>
        </div>
        {/* Featured Category */}
        <div className="bg-green-100 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-green-800 mb-2">Featured Category</h3>
            <h2 className="text-2xl font-bold mb-2">Organic Fruits & Vegetables</h2>
            <p className="text-gray-700 mb-4">Discover our wide range of certified organic produce, sourced from local farms and delivered fresh to your doorstep.</p>
            <ul className="list-disc pl-5 text-green-800 mb-4">
              <li>100% Certified Organic</li>
              <li>Locally Sourced When Available</li>
              <li>No Pesticides or Harmful Chemicals</li>
            </ul>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">Explore Category</button>
          </div>
          <img src={categories[0]?.image} alt="Featured" className="w-64 h-48 object-cover rounded-xl shadow" />
        </div>
        {/* Seasonal Categories */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Seasonal Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seasonal.map((s, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden shadow-lg bg-white min-h-[160px]">
                {s.img ? (
                  <img 
                    src={s.img} 
                    alt={s.name} 
                    className="w-full h-40 object-cover object-center" 
                    onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.style.background = '#d1fae5'; }}
                  />
                ) : (
                  <div className="w-full h-40 bg-green-100 flex items-end" />
                )}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 z-20">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white text-base font-bold drop-shadow mb-1">{s.name}</h3>
                    <span className="bg-white/90 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm mb-1 inline-block">Limited Time</span>
                  </div>
                  <span className="text-white text-xs drop-shadow mb-1">{s.count} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Newsletter Section */}
        <section className="w-full bg-green-50 py-10 flex flex-col items-center justify-center mb-0 px-2 mt-8 rounded-xl shadow">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">Subscribe to our Newsletter</h2>
          <p className="mb-4 text-gray-600 text-base md:text-lg text-center">Stay updated with our latest offers, recipes, and health tips.</p>
          <form className="flex flex-col md:flex-row justify-center items-center gap-2 w-full max-w-xl">
            <input type="email" placeholder="Your email address" className="border rounded px-4 py-2 flex-1 min-w-[180px] md:min-w-[260px] text-base" />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-semibold text-base min-w-[120px]">Subscribe</button>
          </form>
        </section>
      </section>
    </main>
  );
} 