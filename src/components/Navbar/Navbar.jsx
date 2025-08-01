import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronDown, faMagnifyingGlass, faPhone, faRightFromBracket, faUserPlus, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faAddressCard, faEnvelopeOpen, faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import FreshCartLogo from "../../assets/Images/freshcart-logo.svg";
import { apiRequest } from "../../api";
import { useCart } from "../../context/CartContext";
import { useApp } from "../../context/AppContext";
import { getTranslation } from "../../utils/translations";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const { cart = [], wishlist = [] } = useCart();
  const { currency, language, changeCurrency, changeLanguage } = useApp();

  // Simulate token for demo (replace with real auth logic)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    setCategoriesLoading(true);
    apiRequest("/categories")
      .then(data => setCategories(data?.data || []))
      .catch(() => setCategoriesError("Failed to load categories"))
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/Search-products?query=${encodeURIComponent(search)}`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/Login");
  };

  // Handle currency change
  const handleCurrencyChange = (newCurrency) => {
    changeCurrency(newCurrency);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
  };

  return (
    <header className="bg-white shadow border-b border-gray-100 sticky top-0 z-50 w-full">
      <div className="container mx-auto flex flex-col gap-0 px-2 md:px-6 w-full">
        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center py-1 text-xs md:text-sm border-b border-gray-100 bg-white w-full">
          <div className="flex flex-wrap gap-2 md:gap-8 text-gray-500 w-full md:w-auto justify-center md:justify-start">
            <span className="flex items-center gap-1 md:gap-3">
              <FontAwesomeIcon icon={faPhone} size="sm" className="min-w-[16px] md:min-w-[18px]" />
              <a href="tel:+1 (800) 123-4567" className="font-medium">{getTranslation(language, 'phone')}</a>
            </span>
            <span className="flex items-center gap-1 md:gap-3">
              <FontAwesomeIcon icon={faEnvelopeOpen} size="sm" className="min-w-[16px] md:min-w-[18px]" />
              <a href="mailto:support@freshcart.com" className="font-medium">{getTranslation(language, 'email')}</a>
            </span>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 items-center text-gray-500 w-full md:w-auto justify-center md:justify-end mt-2 md:mt-0">
            <NavLink to="/Orders" className={({isActive}) => isActive ? "text-green-600 font-semibold underline" : "hover:text-green-600 font-medium"}>{getTranslation(language, 'trackOrder')}</NavLink>
            <NavLink to="/About" className={({isActive}) => isActive ? "text-green-600 font-semibold underline" : "hover:text-green-600 font-medium"}>{getTranslation(language, 'about')}</NavLink>
            <NavLink to="/Contact" className={({isActive}) => isActive ? "text-green-600 font-semibold underline" : "hover:text-green-600 font-medium"}>{getTranslation(language, 'contact')}</NavLink>
            <select 
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="border rounded px-2 py-1 text-xs md:text-sm focus:outline-green-600 font-medium bg-white hover:bg-green-50 transition-colors"
            >
              <option value="EGP">{getTranslation(language, 'EGP')}</option>
              <option value="SAR">{getTranslation(language, 'SAR')}</option>
              <option value="AED">{getTranslation(language, 'AED')}</option>
            </select>
            <select 
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="border rounded px-2 py-1 text-xs md:text-sm focus:outline-green-600 font-medium bg-white hover:bg-green-50 transition-colors"
            >
              <option value="العربية">{getTranslation(language, 'العربية')}</option>
              <option value="English">{getTranslation(language, 'English')}</option>
            </select>
          </div>
        </div>
        {/* Middle bar: Logo & Search & Icons */}
        <div className="flex flex-wrap items-center py-2 md:py-3 gap-2 md:gap-8 bg-white w-full">
          <NavLink to="/" className="mr-2 md:mr-6 flex items-center min-w-[100px]">
            <img src={FreshCartLogo} alt="Fresh Cart Logo" className="h-8 md:h-10 lg:h-12" />
          </NavLink>
          <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded px-2 md:px-3 py-1 w-full max-w-xs md:max-w-lg min-h-[36px] md:min-h-[40px] mx-2 bg-white flex-1">
            <input
              type="text"
              placeholder={getTranslation(language, 'searchPlaceholder')}
              className="outline-none flex-1 text-xs md:text-base font-medium bg-transparent"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="text-gray-500 hover:text-green-600">
              <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" className="min-w-[18px] md:min-w-[22px]" />
            </button>
          </form>
          <div className="flex flex-wrap items-center gap-1 md:gap-4 min-w-[180px] justify-end">
            <NavLink to="/WishList" className={({isActive}) => isActive ? "relative flex items-center gap-1 text-green-600 font-bold min-h-[40px]" : "relative flex items-center gap-1 text-gray-700 hover:text-green-600 font-semibold min-h-[40px]"}>
              <span className="relative flex items-center">
                <FontAwesomeIcon icon={faHeart} size="lg" className="min-w-[22px]" />
                {wishlist.length > 0 && (
                  <span
                    className="absolute bg-green-600 text-white rounded-full px-1.5 text-[11px] font-bold"
                    style={{
                      top: '-20px',
                      right: '1px',
                      minWidth: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '1',
                      padding: '0 4px'
                    }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </span>
              <span className="text-sm md:text-base">{getTranslation(language, 'wishlist')}</span>
            </NavLink>
            <NavLink to="/Cart" className={({isActive}) => isActive ? "flex items-center gap-1 text-green-600 font-bold min-h-[40px] relative" : "flex items-center gap-1 text-gray-700 hover:text-green-600 font-semibold min-h-[40px] relative"}>
              <FontAwesomeIcon icon={faCartShopping} size="lg" className="min-w-[22px]" />
              <span className="text-sm md:text-base">{getTranslation(language, 'cart')}</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full px-2 text-xs font-bold">{cart.length}</span>
              )}
            </NavLink>
            <NavLink to="/Account" className={({isActive}) => isActive ? "flex items-center gap-1 text-green-600 font-bold min-h-[40px]" : "flex items-center gap-1 text-gray-700 hover:text-green-600 font-semibold min-h-[40px]"}>
              <FontAwesomeIcon icon={faUser} size="lg" className="min-w-[22px]" />
              <span className="text-sm md:text-base">{getTranslation(language, 'account')}</span>
            </NavLink>
            {!isLoggedIn && (
              <>
                <NavLink to="/Signup" className={({isActive}) => isActive ? "flex items-center gap-1 text-green-600 font-bold min-h-[40px]" : "flex items-center gap-1 text-gray-700 font-semibold min-h-[40px]"}>
                  <FontAwesomeIcon icon={faUserPlus} size="lg" className="min-w-[22px]" />
                  <span className="text-sm md:text-base">Signup</span>
            </NavLink>
                <NavLink to="/Login" className={({isActive}) => isActive ? "flex items-center gap-1 text-green-600 font-bold min-h-[40px]" : "flex items-center gap-1 text-gray-700 font-semibold min-h-[40px]"}>
                  <FontAwesomeIcon icon={faAddressCard} size="lg" className="min-w-[22px]" />
                  <span className="text-sm md:text-base">Login</span>
            </NavLink>
              </>
            )}
            {isLoggedIn && (
              <button onClick={handleLogout} className="flex items-center gap-1 text-gray-700 hover:text-green-600 font-bold min-h-[40px]">
                <FontAwesomeIcon icon={faRightFromBracket} size="lg" className="min-w-[22px]" />
                <span className="text-sm md:text-base">Logout</span>
            </button>
            )}
          </div>
        </div>
        {/* Bottom bar: Categories & Navigation */}
        <div className="flex items-center py-2 gap-2 md:gap-6 bg-gray-50 border-t border-b border-gray-100">
          <div className="relative group">
            <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-base font-bold min-h-[40px] shadow hover:bg-green-700 transition">
              <FontAwesomeIcon icon={faBars} size="lg" className="mr-2 min-w-[22px]" />
              <span className="mx-1">All Categories</span>
              <FontAwesomeIcon icon={faChevronDown} size="lg" className="ml-2 min-w-[22px]" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-60 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
              <ul className="py-2">
                {categoriesLoading && (
                  <li className="px-4 py-2 text-gray-400">Loading...</li>
                )}
                {categoriesError && (
                  <li className="px-4 py-2 text-red-500">{categoriesError}</li>
                )}
                {!categoriesLoading && !categoriesError && categories.length > 0 && categories.map(cat => (
                  <li key={cat._id}>
                    <NavLink to={`/Categories/${cat._id}`} className="px-4 py-2 hover:bg-green-50 cursor-pointer font-medium flex items-center gap-2">
                      <FontAwesomeIcon icon={faBars} size="sm" /> {cat.name}
                    </NavLink>
                  </li>
                ))}
                {!categoriesLoading && !categoriesError && categories.length === 0 && (
                  <li className="px-4 py-2 text-gray-400">No categories found</li>
                )}
              </ul>
            </div>
          </div>
          <nav className="flex gap-2 md:gap-6 flex-1">
            <NavLink to="/" className={({isActive}) => isActive ? "text-green-700 font-bold underline" : "hover:text-green-600 font-semibold"}>Home</NavLink>
            <NavLink to="/Categories" className={({isActive}) => isActive ? "text-green-700 font-bold underline" : "hover:text-green-600 font-semibold"}>Categories</NavLink>
            <NavLink to="/Brands" className={({isActive}) => isActive ? "text-green-700 font-bold underline" : "hover:text-green-600 font-semibold"}>Brands</NavLink>
            <NavLink to="/Offers" className={({isActive}) => isActive ? "text-green-700 font-bold underline" : "hover:text-green-600 font-semibold"}>Offers</NavLink>
            <NavLink to="/Search-products" className={({isActive}) => isActive ? "text-green-700 font-bold underline" : "hover:text-green-600 font-semibold"}>Products</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
