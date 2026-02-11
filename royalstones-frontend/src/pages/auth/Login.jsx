import { useState,useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword,signInWithCredential, signInWithPopup,signInWithRedirect,getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { getUserByEmail } from "../../api/auth.api";
import PageWrapper from "../../util/PageWrapper";
import { toast } from 'react-toastify';
import { inAppBrowser } from "../../util/inAppBrowser";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const isInApp = inAppBrowser();

  useEffect(() => {
    // Handle native Android Google Sign-In
    window.handleNativeGoogleSignIn = async (idToken) => {
      try {
        setGoogleLoading(true);
        
        const credential = GoogleAuthProvider.credential(idToken);
        const res = await signInWithCredential(auth, credential);
        
        const token = await res.user.getIdToken();
        setToken(token);
        
        const response = await getUserByEmail(res.user.email);
        if (response) {
          setUser(response?.data);
        }
        
        toast.success("Login success!");
        navigate(-1);
      } catch (err) {
        console.error("Native sign-in error:", err);
        toast.error("Google login failed");
      } finally {
        setGoogleLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const res = await getRedirectResult(auth);
        if (!res) return;
  
        const token = await res.user.getIdToken();
        setToken(token);
  
        const response = await getUserByEmail(res.user.email);
        if (response) setUser(response.data);
  
        toast.success("Login success!");
        navigate(-1);
      } catch (err) {
        console.error(err);
        toast.error("Google login failed");
      }
    };
  
    handleRedirect();
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

  const loginWithGoogle = async () => {
    setGoogleLoading(true);
    
    try {
      // Check if Android native is available
      if (window.Android && window.Android.startGoogleSignIn) {
        window.Android.startGoogleSignIn();
        return;
      }
      
      // Otherwise use web popup
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-gray-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md lg:max-w-lg w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <i class="bi bi-arrow-left float-left cursor-pointer text-md p-1 max-w-4 hover:text-xl hover:transform duration-150 "
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
              {/* <a href="#forgot" className="text-sm text-amber-600 hover:text-amber-700 transition-colors font-semibold">
            Forgot Password?
          </a> */}
            </div>

            {/* Error Message */}
            <div className="flex items-center justify-between mb-6">
              {errorMessage !== '' && (
                <p className="text-sm text-red-600 font-semibold">
                  {errorMessage}
                </p>
              )}
            </div>

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

            {/* Google Login */}
            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900  cursor-pointer font-semibold py-3 rounded-lg transition-colors border border-gray-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {
                googleLoading ?
                  <div className="animate-spin rounded-full flex justify-center items-center h-5 w-5 border-b-2 border-gray-900"></div> : 
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {isInApp ? "Continue in Browser" : "Continue with Google"}
                  </>
              }

            </button>



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