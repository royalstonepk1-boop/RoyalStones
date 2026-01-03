// ============================================================================
// FILE 1: utils/inAppBrowserDetector.js
// ============================================================================

export const inAppBrowser = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return /tiktok|instagram|fbav|fbios|fban|fb_iab/i.test(ua);
};

export const detectSpecificPlatform = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/tiktok/i.test(ua)) return 'TikTok';
  if (/instagram/i.test(ua)) return 'Instagram';
  if (/fbav|fbios|fban|fb_iab/i.test(ua)) return 'Facebook';
  
  return 'this app';
};

export const openInExternalBrowser = () => {
  const currentUrl = window.location.href;
  
  // Try different methods to open in external browser
  const schemes = [
    `googlechrome://navigate?url=${encodeURIComponent(currentUrl)}`,
    `firefox://open-url?url=${encodeURIComponent(currentUrl)}`,
    currentUrl
  ];
  
  schemes.forEach((scheme, index) => {
    setTimeout(() => {
      window.location.href = scheme;
    }, index * 100);
  });
  
  return false;
};


// ============================================================================
// FILE 2: components/InAppBrowserBanner.jsx
// ============================================================================

import { detectSpecificPlatform } from "../utils/inAppBrowserDetector";

export default function InAppBrowserBanner({ onClose }) {
  const platform = detectSpecificPlatform();
  
  const getInstructions = () => {
    switch (platform) {
      case 'TikTok':
        return "Tap the three dots (•••) at the top right, then select 'Open in browser'";
      case 'Instagram':
        return "Tap the three dots (•••) at the top right, then select 'Open in external browser'";
      case 'Facebook':
        return "Tap the three dots (•••) menu and select 'Open in Chrome' or 'Open in Safari'";
      default:
        return "Please open this page in your default browser (Chrome, Safari, etc.)";
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-start gap-3">
            {/* Warning Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1">
                Cannot Sign In from {platform}
              </h3>
              <p className="text-sm text-red-50 mb-2">
                Google authentication is blocked in {platform}'s browser for security reasons.
              </p>
              <div className="bg-red-700 bg-opacity-50 rounded-lg p-3 mb-2">
                <p className="text-sm font-semibold mb-1">
                  💡 How to fix:
                </p>
                <p className="text-sm text-red-50">
                  {getInstructions()}
                </p>
              </div>
            </div>
            
            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 text-white hover:text-red-100 transition-colors p-1"
                aria-label="Close banner"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// FILE 3: pages/Login.jsx
// ============================================================================

import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { getUserByEmail } from "../../api/auth.api";
import PageWrapper from "../../util/PageWrapper";
import { toast } from 'react-toastify';
import { inAppBrowser, openInExternalBrowser } from "../../utils/inAppBrowserDetector";
import InAppBrowserBanner from "../../components/InAppBrowserBanner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  // Detect in-app browser on component mount
  useEffect(() => {
    const isInApp = inAppBrowser();
    setIsInAppBrowser(isInApp);
  }, []);

  const login = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();
      setToken(token);
      if (res) {
        const response = await getUserByEmail(email);
        if (response) {
          setUser(response?.data);
        }
      }
      toast.success("Login success!", {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      navigate(-1);
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // If in in-app browser, show banner and attempt redirect
    if (isInAppBrowser) {
      setShowBanner(true);
      toast.warning('Opening in external browser...', {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Attempt to open in external browser (rarely works but worth trying)
      setTimeout(() => {
        openInExternalBrowser();
      }, 500);
      
      return;
    }
    
    // Normal Google login flow
    loginWithGoogle();
  };

  const loginWithGoogle = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const token = await res.user.getIdToken();
      setToken(token);
      if (res) {
        const response = await getUserByEmail(res.user.email);
        if (response) {
          setUser(response?.data);
        }
      }
      toast.success("Login success!", {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      navigate(-1);
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <PageWrapper>
      {/* Show banner if in-app browser detected */}
      {isInAppBrowser && showBanner && (
        <InAppBrowserBanner 
          onClose={() => setShowBanner(false)}
        />
      )}
      
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-gray-100 flex items-center justify-center px-4 py-12 ${isInAppBrowser && showBanner ? 'pt-48' : ''}`}>
        <div className="max-w-md lg:max-w-lg w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <i className="bi bi-arrow-left float-left cursor-pointer text-md p-1 max-w-4 hover:text-xl hover:transform duration-150"
              onClick={() => navigate('/')}></i>
            <div className="inline-block">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Royal <span className="text-amber-600">Stones</span>
              </h1>
              <div className="h-1 bg-amber-500 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Welcome back! Please login to your account</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-lock text-gray-400"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-gray-50 text-gray-900 pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-amber-500 bg-gray-50 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            {/* Error Message */}
            {errorMessage !== '' && (
              <div className="mb-6">
                <p className="text-sm text-red-600 font-semibold">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 cursor-pointer font-medium py-3 rounded-lg transition-colors disabled:bg-amber-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  Sign In
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Login - Always show the button */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 cursor-pointer font-semibold py-3 rounded-lg transition-colors border border-gray-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="animate-spin rounded-full flex justify-center items-center h-5 w-5 border-b-2 border-gray-900"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {isInAppBrowser ? (
                    <>
                      <span>Continue with Google</span>
                      <i className="bi bi-box-arrow-up-right text-sm"></i>
                    </>
                  ) : (
                    'Continue with Google'
                  )}
                </>
              )}
            </button>

            {/* Extra helper text for in-app browser */}
            {isInAppBrowser && (
              <p className="text-xs text-center text-gray-500 mt-2">
                <i className="bi bi-info-circle mr-1"></i>
                Clicking will attempt to open in your browser
              </p>
            )}

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}


// ============================================================================
// FILE 4: pages/Register.jsx
// ============================================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider, fetchSignInMethodsForEmail } from "firebase/auth";
import { addProfileWithEmail, addProfileWithGoogle } from "../../api/auth.api";
import PageWrapper from "../../util/PageWrapper";
import { useAuthStore } from "../../store/authStore";
import { toast } from 'react-toastify';
import { inAppBrowser, openInExternalBrowser } from "../../utils/inAppBrowserDetector";
import InAppBrowserBanner from "../../components/InAppBrowserBanner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  // Detect in-app browser on component mount
  useEffect(() => {
    const isInApp = inAppBrowser();
    setIsInAppBrowser(isInApp);
  }, []);

  const register = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please agree to the Terms & Conditions");
      return;
    }

    setLoading(true);
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setErrorMessage("Email already exists");
      } else if (signInMethods.length <= 0) {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        if (response) {
          toast.success("Registered successfully!", {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
          const res = await addProfileWithEmail({ uid: response.user.uid, email, password, name });
          setUser(res?.data?.user);
          navigate("/");
        }
      }
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // If in in-app browser, show banner and attempt redirect
    if (isInAppBrowser) {
      setShowBanner(true);
      toast.warning('Opening in external browser...', {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Attempt to open in external browser (rarely works but worth trying)
      setTimeout(() => {
        openInExternalBrowser();
      }, 500);
      
      return;
    }
    
    // Normal Google register flow
    registerWithGoogle();
  };

  const registerWithGoogle = async () => {
    if (!agreeTerms) {
      setErrorMessage("Please agree to the Terms & Conditions");
      return;
    }
    
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      if (response) {
        toast.success("Registered successfully!", {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        const res = await addProfileWithGoogle({ uid: response?.user?.uid, email: response?.user?.email, name: response?.user?.displayName });
        setUser(res?.data?.user);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      register();
    }
  };

  return (
    <PageWrapper>
      {/* Show banner if in-app browser detected */}
      {isInAppBrowser && showBanner && (
        <InAppBrowserBanner 
          onClose={() => setShowBanner(false)}
        />
      )}
      
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-gray-100 flex items-center justify-center px-4 py-12 ${isInAppBrowser && showBanner ? 'pt-48' : ''}`}>
        <div className="max-w-md lg:max-w-lg w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <i className="bi bi-arrow-left float-left cursor-pointer text-md p-1 max-w-4 hover:text-xl hover:transform duration-150"
              onClick={() => navigate('/login')}></i>
            <div className="inline-block">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Royal <span className="text-amber-600">Stones</span>
              </h1>
              <div className="h-1 bg-amber-500 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Create your account and start shopping</p>
          </div>

          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign Up</h2>

            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-person text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  maxLength={30}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-lock text-gray-400"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-gray-50 text-gray-900 pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-lock-fill text-gray-400"></i>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-gray-50 text-gray-900 pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 text-amber-500 bg-gray-50 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="/terms" className="text-amber-600 hover:text-amber-700 font-semibold">
                    Terms & Conditions
                  </a>
                  {" "}and{" "}
                  <a href="/privacy" className="text-amber-600 hover:text-amber-700 font-semibold">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {errorMessage !== '' && (
              <div className="mb-6">
                <p className="text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* Register Button */}
            <button
              onClick={register}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 font-medium py-3 cursor-pointer rounded-lg transition-colors disabled:bg-amber-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus"></i>
                  Create Account
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Sign Up - Always show the button */}
            <button
              onClick={handleGoogleRegister}
              disabled={googleLoading}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 cursor-pointer font-semibold py-3 rounded-lg transition-colors border border-gray-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="animate-spin rounded-full flex justify-center items-center h-5 w-5 border-b-2 border-gray-900"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {isInAppBrowser ? (
                    <>
                      <span>Sign up with Google</span>
                      <i className="bi bi-box-arrow-up-right text-sm"></i>
                    </>
                  ) : (
                    'Sign up with Google'
                  )}
                </>
              )}
            </button>

            {/* Extra helper text for in-app browser */}
            {isInAppBrowser && (
              <p className="text-xs text-center text-gray-500 mt-2">
                <i className="bi bi-info-circle mr-1"></i>
                Clicking will attempt to open in your browser
              </p>
            )}

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}