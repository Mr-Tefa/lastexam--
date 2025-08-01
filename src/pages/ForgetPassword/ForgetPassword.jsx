import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.status === "success") {
        setSuccess(true);
        // حفظ البريد الإلكتروني للاستخدام في صفحة التحقق
        localStorage.setItem("verifyEmail", email);
        localStorage.setItem("isResetPassword", "true");
      } else {
        setError(data.message || "Failed to send reset email. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
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
                <FontAwesomeIcon icon={faLock} className="text-green-600 text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Forgot your password?</h2>
              <p className="text-gray-600 text-center mb-2">No worries! Enter your email address and we'll send you a link to reset your password.</p>
            </div>
            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Reset code sent to <strong>{email}</strong>
                <div className="mt-3">
                  <NavLink to="/VerifyEmail" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                    Verify Reset Code
                  </NavLink>
                </div>
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
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="Your registered email address"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            )}
            <div className="mt-4 text-center text-sm">
              Remember your password?{' '}
              <NavLink to="/Login" className="text-green-600 font-semibold hover:underline">Sign in</NavLink>
            </div>
            <div className="mt-6 bg-gray-50 rounded-lg p-4 text-xs text-gray-600 flex items-center gap-2">
              <span className="text-green-600"><FontAwesomeIcon icon={faLock} /></span>
              <span>For your security, a password reset link will be sent to your registered email address. The link will expire after 30 minutes.</span>
            </div>
          </div>
        </div>
        {/* Additional Help */}
        <div className="w-full max-w-3xl mx-auto mt-12">
          <div className="text-center mb-6 font-semibold text-gray-700 text-lg">Need additional help?</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 text-green-600 text-xl">?</div>
              <div className="font-bold mb-1">Contact Support</div>
              <div className="text-sm text-gray-600 mb-2">Our customer support team is available 24/7 to assist you.</div>
              <a href="mailto:support@freshcart.com" className="text-green-700 font-semibold hover:underline text-sm">Contact Us &rarr;</a>
            </div>
            <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 text-green-600 text-xl">i</div>
              <div className="font-bold mb-1">FAQs</div>
              <div className="text-sm text-gray-600 mb-2">Find answers to frequently asked questions about your account.</div>
              <a href="#" className="text-green-700 font-semibold hover:underline text-sm">View FAQs &rarr;</a>
            </div>
            <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 text-green-600 text-xl">@</div>
              <div className="font-bold mb-1">Email Not Received?</div>
              <div className="text-sm text-gray-600 mb-2">Check your spam folder or request a new reset link.</div>
              <button onClick={() => { setSuccess(false); setEmail(""); }} className="text-green-700 font-semibold hover:underline text-sm">Resend Email &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
