import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faCamera, faTrash, faLock, faDashboard, faBox, faHeart, faStar, faLocationDot, faCreditCard, faEdit, faSave, faTimes, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { apiRequest } from "../../api";
import { useCart } from "../../context/CartContext";

export default function Account() {
  const navigate = useNavigate();
  const { cart, addToCart, addToWishlist } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // بيانات المستخدم
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    image: ""
  });
  
  const [password, setPassword] = useState({ 
    current: "", 
    new: "", 
    confirm: "" 
  });
  
  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  
  // بيانات إضافية للوظائف الأخرى
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // جلب بيانات المستخدم
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // جلب البيانات حسب التاب المحدد
  useEffect(() => {
    switch (activeTab) {
      case "orders":
        fetchOrders();
        break;
      case "wishlist":
        fetchWishlist();
        break;
      case "addresses":
        fetchAddresses();
        break;
      case "payment":
        fetchPaymentMethods();
        break;
    }
  }, [activeTab]);

  async function fetchUserProfile() {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        // محاولة جلب البيانات من API إذا كان هناك token
        try {
          const response = await apiRequest('/users/profile', {
            method: 'GET',
            token: token
          });

          if (response.data) {
            setProfile({
              firstName: response.data.firstName || "",
              lastName: response.data.lastName || "",
              email: response.data.email || "",
              phone: response.data.phone || "",
              dob: response.data.dob || "",
              image: response.data.image || ""
            });
            setImage(response.data.image || "");
            return;
          }
        } catch (error) {
          console.error('Error fetching profile from API:', error);
        }
      }
      
      // استخدام بيانات وهمية إذا لم يكن هناك token أو فشل API
      setProfile({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        dob: "1990-05-15",
        image: ""
      });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // بيانات وهمية في حالة الخطأ
      setProfile({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        dob: "1990-05-15",
        image: ""
      });
    } finally {
      setIsLoading(false);
    }
  }

  // تحديث البيانات الشخصية
  async function handleUpdateProfile() {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        // محاولة التحديث عبر API إذا كان هناك token
        try {
          const response = await apiRequest('/users/profile', {
            method: 'PUT',
            body: {
              firstName: profile.firstName,
              lastName: profile.lastName,
              phone: profile.phone,
              dob: profile.dob
            },
            token: token
          });

          if (response.success) {
            alert('Profile updated successfully!');
            setIsEditing(false);
            return;
          }
        } catch (error) {
          console.error('Error updating profile via API:', error);
        }
      }
      
      // محاكاة التحديث إذا لم يكن هناك token أو فشل API
      alert('Profile updated successfully! (Demo mode)');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }

  // تغيير كلمة المرور
  async function handleChangePassword() {
    if (password.new !== password.confirm) {
      alert('New passwords do not match!');
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        // محاولة تغيير كلمة المرور عبر API إذا كان هناك token
        try {
          const response = await apiRequest('/users/change-password', {
            method: 'PUT',
            body: {
              currentPassword: password.current,
              newPassword: password.new
            },
            token: token
          });

          if (response.success) {
            alert('Password changed successfully!');
            setPassword({ current: "", new: "", confirm: "" });
            return;
          }
        } catch (error) {
          console.error('Error changing password via API:', error);
        }
      }
      
      // محاكاة تغيير كلمة المرور إذا لم يكن هناك token أو فشل API
      alert('Password changed successfully! (Demo mode)');
      setPassword({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }

  // رفع صورة جديدة
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUpdating(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          // محاولة رفع الصورة عبر API إذا كان هناك token
          try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await apiRequest('/users/upload-image', {
              method: 'POST',
              body: formData,
              token: token,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            if (response.success) {
              setImage(response.data.image);
              setProfile(prev => ({ ...prev, image: response.data.image }));
              alert('Profile image updated successfully!');
              return;
            }
          } catch (error) {
            console.error('Error uploading image via API:', error);
          }
        }
        
        // محاكاة رفع الصورة إذا لم يكن هناك token أو فشل API
        const reader = new FileReader();
        reader.onload = (ev) => {
          setImage(ev.target.result);
          setProfile(prev => ({ ...prev, image: ev.target.result }));
          alert('Profile image updated successfully! (Demo mode)');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsUpdating(false);
      }
    }
  }

  // جلب الطلبات - استخدام البيانات الفعلية من Cart
  async function fetchOrders() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiRequest('/orders', {
            method: 'GET',
            token: token
          });
          if (response.data) {
            setOrders(response.data);
            return;
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
      // استخدام بيانات Cart كـ Orders للعرض
      const ordersData = cart.map((item, index) => ({
        id: index + 1,
        orderNumber: `ORD-2024-${String(index + 1).padStart(3, '0')}`,
        status: index === 0 ? "Delivered" : index === 1 ? "Processing" : "Shipped",
        total: item.price,
        date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        product: item
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error in fetchOrders:', error);
    }
  }

  // جلب المفضلة - استخدام البيانات الفعلية من WishList
  async function fetchWishlist() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiRequest('/wishlist', {
            method: 'GET',
            token: token
          });
          if (response.data) {
            setWishlist(response.data);
            return;
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
      // استخدام بيانات وهمية للمفضلة (9 منتجات)
      const wishlistData = cart.slice(0, 9).map((item, index) => ({
        id: index + 1,
        name: item.title,
        price: item.price,
        image: item.imageCover,
        originalItem: item
      }));
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Error in fetchWishlist:', error);
    }
  }

  // جلب العناوين - استخدام البيانات الفعلية من Checkout
  async function fetchAddresses() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiRequest('/addresses', {
            method: 'GET',
            token: token
          });
          if (response.data) {
            setAddresses(response.data);
            return;
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      }
      // بيانات وهمية للعناوين - مشابهة لصفحة Checkout
      setAddresses([
        { 
          id: 1, 
          type: "Home", 
          address: "123 Main Street, Apartment 4B, New York, NY 10001", 
          isDefault: true,
          details: {
            firstName: "John",
            lastName: "Doe",
            city: "New York",
            zip: "10001",
            phone: "+1 (555) 123-4567"
          }
        },
        { 
          id: 2, 
          type: "Work", 
          address: "456 Business Avenue, Suite 200, New York, NY 10002", 
          isDefault: false,
          details: {
            firstName: "John",
            lastName: "Doe",
            city: "New York",
            zip: "10002",
            phone: "+1 (555) 987-6543"
          }
        },
        { 
          id: 3, 
          type: "Summer House", 
          address: "789 Beach Road, Malibu, CA 90265", 
          isDefault: false,
          details: {
            firstName: "John",
            lastName: "Doe",
            city: "Malibu",
            zip: "90265",
            phone: "+1 (555) 456-7890"
          }
        }
      ]);
    } catch (error) {
      console.error('Error in fetchAddresses:', error);
    }
  }

  // جلب طرق الدفع - استخدام البيانات الفعلية من Payment page
  async function fetchPaymentMethods() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiRequest('/payment-methods', {
            method: 'GET',
            token: token
          });
          if (response.data) {
            setPaymentMethods(response.data);
            return;
          }
        } catch (error) {
          console.error('Error fetching payment methods:', error);
        }
      }
      // بيانات وهمية لطرق الدفع - مشابهة لصفحة Payment
      setPaymentMethods([
        { 
          id: 1, 
          type: "Visa", 
          last4: "1234", 
          expiry: "12/25", 
          isDefault: true,
          cardholder: "John Doe",
          brand: "Visa"
        },
        { 
          id: 2, 
          type: "Mastercard", 
          last4: "5678", 
          expiry: "06/26", 
          isDefault: false,
          cardholder: "John Doe",
          brand: "Mastercard"
        },
        { 
          id: 3, 
          type: "PayPal", 
          last4: "****", 
          expiry: "N/A", 
          isDefault: false,
          cardholder: "john.doe@example.com",
          brand: "PayPal"
        }
      ]);
    } catch (error) {
      console.error('Error in fetchPaymentMethods:', error);
    }
  }

  // تسجيل الخروج
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/Login');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 min-h-screen w-full py-6 px-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 flex flex-col gap-6 mb-4 md:mb-0 border border-white/20">
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl border border-green-100/50">
            <div className="relative group">
              <img 
                src={image || "https://via.placeholder.com/80x80?text=Profile"} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-green-200 object-cover shadow-xl group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-gray-800 mb-1">{profile.firstName} {profile.lastName}</div>
              <div className="text-gray-500 text-sm mb-3">{profile.email}</div>
              <div className="flex items-center justify-center gap-2">
                <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full text-xs font-bold shadow-lg">
                  Premium Member
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100/50">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{orders.length}</div>
                <div className="text-xs text-gray-500">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{wishlist.length}</div>
                <div className="text-xs text-gray-500">Wishlist</div>
              </div>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2 mt-4">
            <SidebarLink 
              icon={faUser} 
              label="Profile" 
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <SidebarLink 
              icon={faBox} 
              label="Orders" 
              active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />
            <SidebarLink 
              icon={faHeart} 
              label="Wishlist" 
              active={activeTab === "wishlist"}
              onClick={() => setActiveTab("wishlist")}
            />
            <SidebarLink 
              icon={faLocationDot} 
              label="Addresses" 
              active={activeTab === "addresses"}
              onClick={() => setActiveTab("addresses")}
            />
            <SidebarLink 
              icon={faCreditCard} 
              label="Payment Methods" 
              active={activeTab === "payment"}
              onClick={() => setActiveTab("payment")}
            />
            <div className="border-t border-gray-200 my-3"></div>
            <SidebarLink 
              icon={faSignOutAlt} 
              label="Logout" 
              danger 
              onClick={handleLogout}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
            <span className="hover:text-green-600 cursor-pointer transition-colors duration-200 font-medium">Home</span>
            <span className="text-gray-300">/</span>
            <span className="hover:text-green-600 cursor-pointer transition-colors duration-200 font-medium">My Account</span>
            <span className="text-gray-300">/</span>
            <span className="text-green-600 font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
          </div>
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {activeTab === "profile" && "Account Details"}
                {activeTab === "orders" && "My Orders"}
                {activeTab === "wishlist" && "My Wishlist"}
                {activeTab === "addresses" && "My Addresses"}
                {activeTab === "payment" && "Payment Methods"}
              </h2>
              <p className="text-gray-600 text-lg">
                {activeTab === "profile" && "Manage your personal information and account settings"}
                {activeTab === "orders" && "Track your order history and current deliveries"}
                {activeTab === "wishlist" && "Your saved items and favorite products"}
                {activeTab === "addresses" && "Manage your delivery and billing addresses"}
                {activeTab === "payment" && "Secure payment methods and billing information"}
              </p>
            </div>
            {activeTab !== "profile" && (
              <div className="hidden md:flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-semibold">Live Updates</span>
              </div>
            )}
          </div>
          
          {/* Dynamic Content Based on Active Tab */}
          {activeTab === "profile" && (
            <>
              {/* Profile Picture */}
              <div className="mb-8 p-8 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-3xl border border-green-100/50 shadow-lg">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faCamera} className="text-green-600 text-lg" />
                  </div>
                  Profile Picture
                </h3>
                <div className="flex items-center gap-10">
                  <div className="relative group">
                    <img 
                      src={image || "https://via.placeholder.com/96x96?text=Profile"} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full border-4 border-green-200 object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label htmlFor="profile-upload" className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold cursor-pointer flex items-center gap-3 hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                      <FontAwesomeIcon icon={faCamera} className="text-lg" /> Upload New Photo
                    </label>
                    <input 
                      id="profile-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                    <button 
                      onClick={() => setImage("")} 
                      className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:from-red-200 hover:to-pink-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-lg" /> Remove Photo
                    </button>
                    <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                      <div className="font-bold mb-2">📁 File Requirements:</div>
                      <div className="space-y-1 text-xs">
                        <div><span className="font-semibold">Formats:</span> JPG, PNG, GIF, WebP</div>
                        <div><span className="font-semibold">Max size:</span> 2MB</div>
                        <div><span className="font-semibold">Dimensions:</span> Min 200x200px</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-gray-800 text-2xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-green-600 text-xl" />
                  </div>
                  Personal Information
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    isEditing 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600' 
                      : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  <FontAwesomeIcon icon={isEditing ? faTimes : faEdit} className="text-lg" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={profile.firstName} 
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={profile.lastName} 
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100" 
                    readOnly 
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={profile.phone} 
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    value={profile.dob} 
                    onChange={(e) => setProfile(prev => ({ ...prev, dob: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100" 
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex items-center gap-6">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="text-lg" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border">
                    <span className="font-bold">Last updated:</span> {new Date().toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl border border-gray-200 p-8 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-8 text-2xl flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faLock} className="text-blue-600 text-xl" />
                </div>
                Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={password.current}
                    onChange={(e) => setPassword(prev => ({ ...prev, current: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={password.new}
                    onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={password.confirm}
                    onChange={(e) => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  />
                </div>
              </div>
              
              <div className="mt-8 flex items-center gap-6">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isUpdating || !password.current || !password.new || !password.confirm}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faLock} className="text-lg" />
                      Change Password
                    </>
                  )}
                </button>
                <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                  <span className="font-bold">🔒 Security tip:</span> Use a strong password with numbers and symbols
                </div>
              </div>
            </div>
          </form>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <FontAwesomeIcon icon={faBox} className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Total Orders</h3>
                    <p className="text-2xl font-bold text-green-600">{orders.length}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last 30 days</p>
                  <p className="text-lg font-semibold">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">{order.orderNumber}</h3>
                        <p className="text-gray-500 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                        {order.product && (
                          <div className="flex items-center gap-3 mt-3">
                            <img src={order.product.imageCover} alt={order.product.title} className="w-12 h-12 object-cover rounded-lg" />
                            <div>
                              <p className="font-semibold text-sm">{order.product.title}</p>
                              <div className="flex items-center gap-1 text-yellow-500 text-xs">
                                <FontAwesomeIcon icon={faStar} />
                                <span className="font-bold text-gray-700">{order.product.ratingsAverage || 4.5}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-gray-800">${order.total}</p>
                        <span className={`px-4 py-2 rounded-full text-xs font-semibold ${
                          order.status === "Delivered" ? "bg-green-100 text-green-700" :
                          order.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => navigate(`/Product/${order.product?._id || order.product?.id || order.id || '6428e778dc1175abc65ca08a'}`)}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => navigate('/Orders')}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <FontAwesomeIcon icon={faHeart} className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Wishlist Items</h3>
                    <p className="text-2xl font-bold text-red-600">{wishlist.length}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-lg font-semibold">${wishlist.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition group">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition" />

                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{item.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs mb-2">
                      <FontAwesomeIcon icon={faStar} />
                      <span className="font-bold text-gray-700">4.5</span>
                      <span className="text-gray-400">(120)</span>
                    </div>
                    <p className="text-green-600 font-bold text-xl mb-4">${item.price}</p>
                                          <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            if (item.originalItem) {
                              addToCart(item.originalItem);
                          } else {
                            // إذا لم يكن هناك originalItem، استخدم البيانات المتاحة
                            const productData = {
                              _id: item.id,
                              title: item.name,
                              price: item.price,
                              imageCover: item.image
                            };
                            addToCart(productData);
                          }
                        }}
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl"
                      >
                        Add to Cart
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <FontAwesomeIcon icon={faLocationDot} className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Saved Addresses</h3>
                    <p className="text-2xl font-bold text-blue-600">{addresses.length}</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                  Add New Address
                </button>
              </div>
              
              <div className="grid gap-6">
                {addresses.map((address) => (
                  <div key={address.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg text-gray-800">{address.type}</h3>
                          {address.isDefault && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Default Address
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-lg mb-2">{address.address}</p>
                        {address.details && (
                          <div className="text-sm text-gray-500 space-y-1">
                            <p><span className="font-semibold">Contact:</span> {address.details.firstName} {address.details.lastName}</p>
                            <p><span className="font-semibold">Phone:</span> {address.details.phone}</p>
                            <p><span className="font-semibold">City:</span> {address.details.city}, ZIP: {address.details.zip}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 hover:bg-blue-50 rounded-lg transition">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 font-semibold px-4 py-2 hover:bg-red-50 rounded-lg transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <FontAwesomeIcon icon={faCreditCard} className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Payment Methods</h3>
                    <p className="text-2xl font-bold text-purple-600">{paymentMethods.length}</p>
                  </div>
                </div>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg hover:shadow-xl">
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                  Add New Card
                </button>
              </div>
              
              <div className="grid gap-6">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="font-bold text-gray-600">{method.type}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{method.type} •••• {method.last4}</h3>
                          <p className="text-gray-500 text-sm">Expires {method.expiry}</p>
                          {method.cardholder && (
                            <p className="text-gray-500 text-sm">Cardholder: {method.cardholder}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {method.isDefault && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Default
                          </span>
                        )}
                        <button className="text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 hover:bg-blue-50 rounded-lg transition">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 font-semibold px-4 py-2 hover:bg-red-50 rounded-lg transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
        active 
          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-xl' 
          : danger 
            ? 'text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:shadow-lg' 
            : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-lg'
      }`}
    >
      <FontAwesomeIcon icon={icon} className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
      {label}
    </button>
  );
} 