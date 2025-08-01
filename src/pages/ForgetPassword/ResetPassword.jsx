import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash, faKey } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState(localStorage.getItem("verifyEmail") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must be at least 8 characters, contain an uppercase letter and a number.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password })
      });
      const data = await response.json();
      if (data.status === "success") {
        setSuccess(true);
        // حذف البريد الإلكتروني من localStorage بعد نجاح إعادة التعيين
        localStorage.removeItem("verifyEmail");
        localStorage.removeItem("isResetPassword");
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center py-16">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faKey} className="text-green-600 text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Reset Password</h2>
              <p className="text-gray-600 text-center mb-2">Enter your email address and new password to reset your account password.</p>
            </div>
            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
                Password reset successfully! You can now <NavLink to="/Login" className="underline font-semibold">Sign In</NavLink>.
              </div>
            ) : null}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center text-sm">
                {error}
              </div>
            )}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-12 bg-gray-50 text-gray-600"
                    />
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 ml-1">
                    Password must contain:<br />
                    <span className={password.length >= 8 ? 'text-green-600' : ''}>• At least 8 characters</span><br />
                    <span className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>• One uppercase letter</span><br />
                    <span className={/[0-9]/.test(password) ? 'text-green-600' : ''}>• One number</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}
            <div className="mt-4 text-center text-sm">
              Remember your password?{' '}
              <NavLink to="/Login" className="text-green-600 font-semibold hover:underline">Sign In</NavLink>
            </div>
            <div className="mt-4 text-center text-xs text-gray-500">
              Need help? <a href="mailto:support@freshcart.com" className="text-green-600 font-semibold hover:underline">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 