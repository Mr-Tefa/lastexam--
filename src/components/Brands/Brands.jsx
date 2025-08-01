import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { apiRequest } from "../../api";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getBrands();
  }, []);

  const getBrands = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/brands");
      setBrands(data.data || []);
    } catch {
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  // فلترة العلامات التجارية حسب البحث
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-lg font-bold">Loading...</div>;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        {/* Featured Brands */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Our Partner Brands</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Discover quality products from our trusted brand partners. We’ve partnered with leading brands to bring you the best selection of fresh and organic products.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {brands.slice(0, 3).map(brand => (
            <div key={brand._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                {brand.image ? (
                  <img src={brand.image} alt={brand.name} className="w-20 h-20 object-contain" />
                ) : (
                  <span className="text-3xl font-bold text-green-600">{brand.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-lg mb-1 text-gray-800">{brand.name}</h3>
                <p className="text-gray-500 text-sm mb-2">Bringing the freshest organic products from farm to table.</p>
                <div className="text-xs text-gray-400 mb-1">{brand.productsCount || 0} Products</div>
                <a href="#brands-list" className="text-green-600 font-semibold hover:underline text-sm">View Products</a>
              </div>
            </div>
          ))}
        </div>
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        {/* Brands Grid */}
        <div id="brands-list" className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {filteredBrands.map((brand) => (
            <div key={brand._id} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="w-16 h-16 bg-green-50 rounded-full mb-3 flex items-center justify-center overflow-hidden">
                {brand.image ? (
                  <img src={brand.image} alt={brand.name} className="w-12 h-12 object-contain" />
                ) : (
                  <span className="text-2xl font-bold text-green-600">{brand.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="font-bold text-base mb-1 text-gray-800 group-hover:text-green-600 transition-colors">{brand.name}</h3>
              <div className="text-xs text-gray-400 mb-1">{brand.productsCount || 0} Products</div>
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="text-xs" />
                ))}
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-xs">View Products</button>
            </div>
          ))}
        </div>
        {/* Newsletter Section */}
        <section className="bg-green-600 rounded-xl p-8 text-white text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Stay Updated with New Brands</h2>
          <p className="mb-6 text-green-100">Get notified when we add new partner brands and exclusive offers</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </main>
  );
} 