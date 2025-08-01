import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // قراءة السلة من localStorage عند أول تحميل
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });
  // قراءة المفضلة من localStorage عند أول تحميل
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  // حفظ السلة في localStorage عند كل تغيير
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // حفظ المفضلة في localStorage عند كل تغيير
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // دالة لإضافة منتج للسلة (مثال بسيط)
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // دالة لإضافة منتج للمفضلة (مثال بسيط)
  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => [...prevWishlist, product]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, wishlist, setWishlist, addToCart, addToWishlist }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 