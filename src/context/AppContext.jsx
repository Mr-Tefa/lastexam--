import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '../utils/translations';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currency, setCurrency] = useState('EGP');
  const [language, setLanguage] = useState('العربية');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // تحميل القيم المحفوظة عند بدء التطبيق
    const savedCurrency = localStorage.getItem('currency');
    const savedLanguage = localStorage.getItem('language');
    
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
    
    // إظهار رسالة تأكيد
    const currencyName = getTranslation(language, newCurrency);
    const message = `${getTranslation(language, 'currencyChanged')} ${currencyName}`;
    showToast(message, 'success');
    
    // تحديث اتجاه النص حسب اللغة
    document.documentElement.setAttribute('data-currency', newCurrency);
    if (language === 'العربية') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // إظهار رسالة تأكيد
    const languageName = getTranslation(newLanguage, newLanguage);
    const message = `${getTranslation(newLanguage, 'languageChanged')} ${languageName}`;
    showToast(message, 'success');
    
    // تحديث اتجاه النص حسب اللغة
    document.documentElement.setAttribute('data-language', newLanguage);
    if (newLanguage === 'العربية') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  };

  return (
    <AppContext.Provider value={{
      currency,
      language,
      changeCurrency,
      changeLanguage,
      showToast,
      removeToast
    }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </AppContext.Provider>
  );
};

// Toast Component
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-green-500 border-green-600';
    }
  };

  return (
    <div className={`transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-white min-w-[300px] ${getToastStyles()}`}>
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}; 