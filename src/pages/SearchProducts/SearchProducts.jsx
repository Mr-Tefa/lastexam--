import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCartPlus, faStar, faList, faTh } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import LoadingCart from "../../components/LoadingCart";

const PRODUCTS_API = "https://ecommerce.routemisr.com/api/v1/products";
const CATEGORIES_API = "https://ecommerce.routemisr.com/api/v1/categories";
const BRANDS_API = "https://ecommerce.routemisr.com/api/v1/brands";

export default function SearchProducts() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("relevance");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { addToCart, addToWishlist } = useCart();

  // جلب المنتجات بناءً على البحث والفلاتر
  useEffect(() => {
    setLoading(true);
    let url = `${PRODUCTS_API}?page=${page}&limit=6`;
    if (query) url += `&keyword=${encodeURIComponent(query)}`;
    if (filters.category) url += `&category=${filters.category}`;
    if (filters.brand) url += `&brand=${filters.brand}`;
    if (filters.priceMin) url += `&price[gte]=${filters.priceMin}`;
    if (filters.priceMax) url += `&price[lte]=${filters.priceMax}`;
    if (filters.rating) url += `&ratingsAverage[gte]=${filters.rating}`;
    if (sort && sort !== "relevance") url += `&sort=${sort}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      });
  }, [query, filters, sort, page]);

  // جلب الفئات والعلامات التجارية
  useEffect(() => {
    fetch(CATEGORIES_API)
      .then(res => res.json())
      .then(data => setCategories(data.data || []));
    fetch(BRANDS_API)
      .then(res => res.json())
      .then(data => setBrands(data.data || []));
    // جلب المنتجات التي تمت مشاهدتها مؤخراً (اختياري)
    fetch(`${PRODUCTS_API}?recentlyViewed=true`)
      .then(res => res.json())
      .then(data => setRecentlyViewed(data.data || []));
  }, []);

  // تغيير الفلاتر
  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setPage(1);
  };

  // تغيير الترتيب
  const handleSortChange = e => setSort(e.target.value);

  // تغيير طريقة العرض
  const handleViewChange = v => setView(v);

  // تغيير الصفحة
  const handlePageChange = p => setPage(p);

  if (loading) return <LoadingCart />;

  return (
    <main className="container mx-auto px-2 md:px-8 py-8">
      <div className="mb-4 text-sm text-gray-500">Home &gt; Search Results</div>
      <h2 className="text-2xl font-bold mb-2">Search Results for "{query}"</h2>
      <div className="mb-4 text-gray-600">We found {products.length} products for you</div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded shadow p-4 mb-4">
            <h3 className="font-bold mb-2">Categories</h3>
            <ul className="space-y-1">
              {categories.map(cat => (
                <li key={cat._id}>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="category" checked={filters.category === cat._id} onChange={() => handleFilterChange("category", cat._id)} />
                    {cat.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded shadow p-4 mb-4">
            <h3 className="font-bold mb-2">Brands</h3>
            <ul className="space-y-1">
              {brands.map(brand => (
                <li key={brand._id}>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="brand" checked={filters.brand === brand._id} onChange={() => handleFilterChange("brand", brand._id)} />
                    {brand.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded shadow p-4 mb-4">
            <h3 className="font-bold mb-2">Price Range</h3>
            <div className="flex gap-2 items-center">
              <input type="number" placeholder="Min" className="border rounded px-2 py-1 w-16" value={filters.priceMin || ""} onChange={e => handleFilterChange("priceMin", e.target.value)} />
              <span>-</span>
              <input type="number" placeholder="Max" className="border rounded px-2 py-1 w-16" value={filters.priceMax || ""} onChange={e => handleFilterChange("priceMax", e.target.value)} />
            </div>
          </div>
          <div className="bg-white rounded shadow p-4 mb-4">
            <h3 className="font-bold mb-2">Ratings</h3>
            <ul className="space-y-1">
              {[5,4,3,2,1].map(star => (
                <li key={star}>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="rating" checked={filters.rating == star} onChange={() => handleFilterChange("rating", star)} />
                    <span className="flex gap-1 text-yellow-400">{Array.from({length: star}).map((_,i) => <FontAwesomeIcon key={i} icon={faStar} />)}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <button className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 mt-2">Apply Filters</button>
        </aside>
        {/* Products Grid */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button onClick={() => handleViewChange("grid")} className={`border rounded px-2 py-1 ${view === "grid" ? "bg-green-600 text-white" : "text-gray-600"}`}><FontAwesomeIcon icon={faTh} /></button>
              <button onClick={() => handleViewChange("list")} className={`border rounded px-2 py-1 ${view === "list" ? "bg-green-600 text-white" : "text-gray-600"}`}><FontAwesomeIcon icon={faList} /></button>
            </div>
            <select className="border rounded px-2 py-1" value={sort} onChange={handleSortChange}>
              <option value="relevance">Sort by: Relevance</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="ratingsAverage">Rating: High to Low</option>
            </select>
          </div>
          <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "flex flex-col gap-4"}>
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow p-3 flex flex-col relative group hover:shadow-lg transition">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition" onClick={() => addToWishlist(product)}><FontAwesomeIcon icon={faHeart} /></button>
                <img src={product.imageCover} alt={product.title} className="w-full h-36 object-contain mb-2" />
                <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
                <div className="font-semibold text-sm mb-1 line-clamp-2 min-h-[36px]">{product.title}</div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-yellow-400"><FontAwesomeIcon icon={faStar} /></span>
                  <span className="text-xs font-bold text-gray-700">{product.ratingsAverage}</span>
                  <span className="text-xs text-gray-400">({product.ratingsQuantity})</span>
                </div>
                <div className="font-bold text-green-700 text-base">{product.price} EGP</div>
                <button className="mt-auto bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center self-end hover:bg-green-700 transition" onClick={() => addToCart(product)}>
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)} className={`border px-3 py-1 rounded ${page === i + 1 ? "bg-green-600 text-white" : ""}`}>{i + 1}</button>
            ))}
          </div>
        </section>
      </div>
      {/* Recently Viewed */}
      <section className="mt-12">
        <h3 className="text-xl font-bold mb-4">Recently Viewed</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recentlyViewed.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow p-3 flex flex-col relative group hover:shadow-lg transition">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition"><FontAwesomeIcon icon={faHeart} /></button>
              <img src={product.imageCover} alt={product.title} className="w-full h-24 object-contain mb-2" />
              <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
              <div className="font-semibold text-sm mb-1 line-clamp-2 min-h-[36px]">{product.title}</div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400"><FontAwesomeIcon icon={faStar} /></span>
                <span className="text-xs font-bold text-gray-700">{product.ratingsAverage}</span>
                <span className="text-xs text-gray-400">({product.ratingsQuantity})</span>
              </div>
              <div className="font-bold text-green-700 text-base">${product.price}</div>
              <button className="mt-auto bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center self-end hover:bg-green-700 transition">
                <FontAwesomeIcon icon={faCartPlus} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
