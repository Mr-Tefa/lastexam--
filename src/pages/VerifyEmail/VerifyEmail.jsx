import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import LoadingCart from "../../components/LoadingCart";

export default function VerifyEmail() {
  const navigate = useNavigate();
  // جلب الإيميل من localStorage أو state
  const [email] = useState(localStorage.getItem("verifyEmail") || "john.doe@example.com");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(180); // 3 دقائق
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const inputRefs = useRef([]);

  // عداد تنازلي
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // تنقل تلقائي بين الخانات
  const handleInputChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    const newCode = [...code];
    newCode[idx] = val[val.length - 1];
    setCode(newCode);
    if (idx < 5 && val) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // تحقق الكود
  const handleVerify = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // التحقق من نوع العملية (تسجيل جديد أم إعادة تعيين كلمة مرور)
      const isResetPassword = localStorage.getItem("isResetPassword") === "true";
      
      const apiUrl = isResetPassword 
        ? "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode"
        : "https://ecommerce.routemisr.com/api/v1/auth/verifyEmail";
      
      const requestBody = isResetPassword
        ? { email, resetCode: code.join("") }
        : { email, code: code.join("") };
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      if (data.status === "success") {
        if (isResetPassword) {
          setSuccess("Code verified successfully! Redirecting to reset password...");
          setTimeout(() => navigate("/ResetPassword"), 1500);
        } else {
          setSuccess("Email verified successfully! Redirecting to login...");
          localStorage.removeItem("verifyEmail");
          localStorage.removeItem("isResetPassword");
          setTimeout(() => navigate("/Login"), 1500);
        }
      } else {
        setError(data.message || "Invalid code. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // إعادة إرسال الكود
  const handleResend = async () => {
    setResending(true);
    setResendSuccess("");
    setError("");
    try {
      const isResetPassword = localStorage.getItem("isResetPassword") === "true";
      
      const apiUrl = isResetPassword 
        ? "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords"
        : "https://ecommerce.routemisr.com/api/v1/auth/sendEmail";
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.status === "success") {
        const message = isResetPassword ? "Reset code resent successfully!" : "Verification code resent successfully!";
        setResendSuccess(message);
        setTimer(180);
      } else {
        setError(data.message || "Failed to resend code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // تنسيق الوقت
  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');

  if (loading) return <LoadingCart />;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center py-16">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-600 text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {localStorage.getItem("isResetPassword") === "true" ? "Verify Reset Code" : "Verify Email"}
            </h1>
            <p className="text-gray-600 text-center mb-2">
              We've sent a verification code to your email address
            </p>
            <span className="text-green-700 font-semibold text-sm mb-2">{email}</span>
          </div>

          {/* رسائل */}
          {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          {resendSuccess && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">{resendSuccess}</div>}

          {/* إدخال الكود */}
          <div className="flex justify-center gap-2 mb-4">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputRefs.current[idx] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-2xl font-bold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={digit}
                onChange={e => handleInputChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                disabled={loading}
              />
            ))}
          </div>

          {/* العداد وزر التحقق */}
          <div className="text-center text-gray-600 text-sm mb-2">
            Code expires in <span className="text-green-600 font-bold">{minutes}:{seconds}</span>
          </div>
          <button
            onClick={handleVerify}
            disabled={loading || code.some(d => !d) || timer === 0}
            className={`w-full py-3 rounded-lg font-semibold transition-colors mb-4 ${loading || code.some(d => !d) || timer === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          {/* روابط */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <button
              onClick={handleResend}
              disabled={resending || timer > 0}
              className={`text-green-700 font-semibold hover:underline disabled:text-gray-400`}
            >
              {resending ? 'Resending...' : 'Resend Code'}
            </button>
            <NavLink to="/Login" className="text-green-700 font-semibold hover:underline text-sm">
              {localStorage.getItem("isResetPassword") === "true" ? "Back to Sign In" : "Back to Login"}
            </NavLink>
          </div>
          <div className="text-center text-xs text-gray-400 mt-2">
            Need help? <a href="mailto:support@freshcart.com" className="text-green-600 hover:underline">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
