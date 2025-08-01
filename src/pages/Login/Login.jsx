import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle as faGoogleBrand, faFacebook as faFacebookBrand } from "@fortawesome/free-brands-svg-icons";
import FreshCartLogo from "../../assets/Images/freshcart-logo.svg";
import LoginImg from "../../assets/Images/login-img.png";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        navigate("/");
        window.dispatchEvent(new CustomEvent('loginStatusChanged'));
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // alert("Google login functionality will be implemented soon!");
  };
  const handleFacebookLogin = () => {
    // alert("Facebook login functionality will be implemented soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl">
        {/* Left Side: Illustration & Info */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center mb-8 md:mb-0 max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full max-w-xs md:max-w-md">
            <img src={LoginImg} alt="Groceries" className="w-40 h-40 md:w-48 md:h-48 object-contain mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Fresh Groceries Delivered</h2>
            <p className="text-gray-600 text-center mb-4">Join thousands of happy customers who trust FreshCart for their daily grocery needs</p>
            <div className="flex gap-4 justify-center mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <span className="text-lg">🚚</span> Free Delivery
              </span>
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <span className="text-lg">💳</span> Secure Payment
              </span>
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <span className="text-lg">📞</span> 24/7 Support
              </span>
            </div>
          </div>
        </div>
        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs md:max-w-md">
            <div className="flex items-center mb-6 justify-center">
              <img src={FreshCartLogo} alt="FreshCart Logo" className="h-8 mr-2" />
              <span className="text-2xl font-bold text-green-700">FreshCart</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-center">Welcome Back!</h3>
            <p className="mb-6 text-gray-600 text-center">Sign in to continue your fresh shopping experience</p>
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 mb-3 font-semibold hover:bg-gray-50 transition-colors"
            >
              <FontAwesomeIcon icon={faGoogleBrand} className="text-red-500 text-lg" />
              Continue with Google
            </button>
            <button 
              onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 mb-6 font-semibold hover:bg-gray-50 transition-colors"
            >
              <FontAwesomeIcon icon={faFacebookBrand} className="text-blue-600 text-lg" />
              Continue with Facebook
            </button>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 px-4">OR CONTINUE WITH EMAIL</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <NavLink to="/ForgetPassword" className="text-green-600 text-xs font-semibold hover:underline">
                    Forgot Password?
                  </NavLink>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12" 
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="keep-signed-in" 
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="accent-green-600" 
                />
                <label htmlFor="keep-signed-in" className="text-sm text-gray-600">
                  Keep me signed in
                </label>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-base hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              New to FreshCart?{" "}
              <NavLink to="/Signup" className="text-green-600 font-semibold hover:underline">
                Create an account
              </NavLink>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-400">
              <span>SSL Secured</span>
              <span>•</span>
              <span>50K+ Users</span>
              <span>•</span>
              <span>4.9 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
