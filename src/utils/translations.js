export const translations = {
  العربية: {
    // Navigation
    home: "الرئيسية",
    categories: "الفئات",
    brands: "العلامات التجارية",
    offers: "العروض",
    products: "المنتجات",
    cart: "السلة",
    wishlist: "المفضلة",
    account: "الحساب",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    logout: "تسجيل الخروج",
    trackOrder: "تتبع الطلب",
    about: "عنّا",
    contact: "اتصل بنا",
    allCategories: "جميع الفئات",
    
    // Search
    searchPlaceholder: "البحث عن المنتجات...",
    
    // Contact Info
    phone: "+1 (800) 123-4567",
    email: "support@freshcart.com",
    
    // Messages
    currencyChanged: "تم تغيير العملة إلى",
    languageChanged: "تم تغيير اللغة إلى",
    loading: "جاري التحميل...",
    noCategories: "لا توجد فئات",
    failedToLoad: "فشل في تحميل البيانات",
    
    // Currency Names
    EGP: "جنيه مصري",
    SAR: "ريال سعودي",
    AED: "درهم إماراتي",
    
    // Language Names
    العربية: "العربية",
    English: "English"
  },
  English: {
    // Navigation
    home: "Home",
    categories: "Categories",
    brands: "Brands",
    offers: "Offers",
    products: "Products",
    cart: "Cart",
    wishlist: "Wishlist",
    account: "Account",
    login: "Login",
    signup: "Signup",
    logout: "Logout",
    trackOrder: "Track Order",
    about: "About",
    contact: "Contact",
    allCategories: "All Categories",
    
    // Search
    searchPlaceholder: "Search for products...",
    
    // Contact Info
    phone: "+1 (800) 123-4567",
    email: "support@freshcart.com",
    
    // Messages
    currencyChanged: "Currency changed to",
    languageChanged: "Language changed to",
    loading: "Loading...",
    noCategories: "No categories found",
    failedToLoad: "Failed to load data",
    
    // Currency Names
    EGP: "Egyptian Pound",
    SAR: "Saudi Riyal",
    AED: "UAE Dirham",
    
    // Language Names
    العربية: "العربية",
    English: "English"
  }
};

export const getTranslation = (language, key) => {
  return translations[language]?.[key] || key;
}; 