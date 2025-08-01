// أسعار العملات مقابل الدولار الأمريكي (USD)
export const currencyRates = {
  USD: 1,
  EGP: 31.15, // 1 USD = 31.15 EGP
  SAR: 3.75,  // 1 USD = 3.75 SAR
  AED: 3.67   // 1 USD = 3.67 AED
};

// رموز العملات
export const currencySymbols = {
  USD: '$',
  EGP: 'ج.م',
  SAR: 'ر.س',
  AED: 'د.إ'
};

// تحويل العملة
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  // تحويل إلى USD أولاً
  const usdAmount = amount / currencyRates[fromCurrency];
  // ثم تحويل من USD إلى العملة المطلوبة
  return usdAmount * currencyRates[toCurrency];
};

// تنسيق السعر
export const formatPrice = (price, currency) => {
  const symbol = currencySymbols[currency] || currency;
  const formattedPrice = parseFloat(price).toFixed(2);
  
  if (currency === 'EGP') {
    return `${formattedPrice} ${symbol}`;
  } else if (currency === 'SAR') {
    return `${symbol} ${formattedPrice}`;
  } else if (currency === 'AED') {
    return `${symbol} ${formattedPrice}`;
  } else {
    return `${symbol}${formattedPrice}`;
  }
}; 