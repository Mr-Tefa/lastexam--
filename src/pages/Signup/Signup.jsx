import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faGoogle as faGoogleBrand, faFacebook as faFacebookBrand } from "@fortawesome/free-brands-svg-icons";
import LoadingCart from "../../components/LoadingCart";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
    phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptOffers, setAcceptOffers] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.rePassword) {
      setError("All required fields must be filled");
      return false;
    }
    if (formData.password !== formData.rePassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (!acceptTerms) {
      setError("You must accept the Terms of Service and Privacy Policy");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          rePassword: formData.rePassword,
          phone: formData.phone
        })
      });
      const data = await response.json();
      if (data.status === "success") {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        localStorage.setItem("verifyEmail", formData.email);
        localStorage.setItem("isResetPassword", "false");
        navigate("/VerifyEmail");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // alert("Google signup functionality will be implemented soon!");
  };
  const handleFacebookSignup = () => {
    // alert("Facebook signup functionality will be implemented soon!");
  };

  const passwordStrength = () => {
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    if (score === 0) return "";
    if (score <= 2) return "Weak";
    if (score === 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">
        {/* القسم الأيسر: ترحيب ومميزات */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-green-50 to-green-100">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Welcome to <span className="text-green-600">FreshCart</span>
          </h2>
          <p className="mb-6 text-gray-600">
            Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.
          </p>
          <ul className="space-y-4 mb-6">
            <li className="flex items-center gap-3">
              <span className="bg-green-100 text-green-600 rounded-full p-2">
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className="font-medium">Fresh & Organic</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-green-100 text-green-600 rounded-full p-2">
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className="font-medium">Fast Delivery</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="bg-green-100 text-green-600 rounded-full p-2">
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className="font-medium">Secure Shopping</span>
            </li>
          </ul>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-gray-500">S</span>
              <span className="font-semibold">Sarah Johnson</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
            <p className="text-gray-600 text-sm">
              "FreshCart has completely changed how I shop for groceries. The quality is amazing and delivery is always on time!"
            </p>
          </div>
        </div>
        {/* القسم الأيمن: فورم التسجيل */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-2 text-center">Create Your Account</h3>
          <p className="text-gray-500 mb-6 text-center">Start your fresh journey with us today</p>
          {/* Social Signup Buttons */}
          <div className="flex gap-3 mb-4">
            <button 
              onClick={handleGoogleSignup}
              className="flex-1 border border-gray-200 rounded-lg py-3 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <FontAwesomeIcon icon={faGoogleBrand} className="text-red-500" />
              Google
            </button>
            <button 
              onClick={handleFacebookSignup}
              className="flex-1 border border-gray-200 rounded-lg py-3 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <FontAwesomeIcon icon={faFacebookBrand} className="text-blue-600" />
              Facebook
            </button>
          </div>
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name *" 
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                required 
              />
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name *" 
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                required 
              />
            </div>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address *" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              required 
            />
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password *" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
              <div className="text-xs text-gray-500 mt-2 ml-1">
                Must be at least 8 characters with numbers and symbols
                <span className={`ml-2 font-semibold ${passwordStrength() === 'Strong' ? 'text-green-600' : passwordStrength() === 'Medium' ? 'text-yellow-600' : 'text-gray-400'}`}>{passwordStrength()}</span>
              </div>
            </div>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="rePassword"
                value={formData.rePassword}
                onChange={handleInputChange}
                placeholder="Confirm Password *" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <input 
                type="checkbox" 
                id="offers" 
                checked={acceptOffers}
                onChange={(e) => setAcceptOffers(e.target.checked)}
                className="accent-green-600 mt-1" 
              />
              <label htmlFor="offers" className="text-gray-600">
                I'd like to receive promotional emails about new products, discounts, and exclusive offers.
              </label>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="accent-green-600 mt-1" 
                required 
              />
              <label htmlFor="terms" className="text-gray-600">
                I agree to the <a href="#" className="text-green-600 underline">Terms of Service</a> and <a href="#" className="text-green-600 underline">Privacy Policy</a>
              </label>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <LoadingCart /> : (
                "Create My Account"
              )}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <NavLink to="/Login" className="text-green-600 font-semibold underline">
              Sign In
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
