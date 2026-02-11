import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import SubNavBar from "./SubNavBar";
import CategoryNavBar from "./CategoryNavBar";
import NavBarLogo from "../../Images/NavBarLogo.jpeg";
import { toast } from 'react-toastify';
import SearchModal from '../../pages/SearchModal';
import { fetchProducts } from '../../api/product.api';
import { useMessageStore } from "../../store/messageStore";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logoutUser = useAuthStore((s) => s.logout);

  const cart = useCartStore((s) => s.cart);
  const openCart = useCartStore((s) => s.openCart);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const reset = useMessageStore((s) => s.reset);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCart();
  }, [user])

  useEffect(() => {
    const Products = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    Products();
  }, []);

  const logout= () => {
    logoutUser();
    reset();
    toast.success("Logout success!", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
    navigate("/");  
  }


  return (
    <>
      <SubNavBar />
      <nav className={`bg-white shadow-md sticky top-0 z-50 max-h-[90px] ${location.pathname === '/login' || location.pathname === '/register' ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex md:hidden justify-between items-center px-4 max-[393px]:px-1 py-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-xl sm:text-2xl cursor-pointer"
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wide">
            <img src={NavBarLogo} alt="logo" className="min-w-[140px] max-[392px]:min-w-[100px] max-[360px]:min-w-[80px] max-h-[70px]" />
          </Link>

          {/* Desktop Bottom Nav */}
          <div className="hidden xl:flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Home</Link>
            <Link to="/shop" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Gemstones</Link>
            <Link to="/star" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Birthstone</Link>
            <Link to="/about" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">About Stones</Link>
            <Link to="/contact" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Contact Us</Link>
            {
              user?.role !== "admin" && (
                <Link to="/orders" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Orders</Link>
              )
            }
            {user?.role === "admin" && (
              <Link to="/admin" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Admin</Link>
            )} </div>
          {/* Mobile Bottom Navbar */}
          <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t flex justify-center gap-8 items-center py-2 text-xs font-medium z-50">
            <Link to="/" className="flex flex-col items-center text-[10px] max-[392px]:text-[9px] "><i className="bi bi-house text-lg"></i>Home</Link>
            <Link to="/shop" className="flex flex-col items-center text-[10px] max-[392px]:text-[9px] "><i className="bi bi-gem text-lg"></i>Shop</Link>
            <Link to="/star" className="flex flex-col items-center text-[10px] max-[392px]:text-[9px] "><i className="bi bi-moon-stars text-lg"></i>Birthstone</Link>
            <Link to="/about" className="flex flex-col items-center text-[10px] max-[392px]:text-[9px] "><i className="bi bi-info-circle text-lg"></i>About</Link>
            <Link to="/contact" className="flex flex-col items-center text-[10px] max-[392px]:text-[9px] "><i className="bi bi-telephone text-lg"></i>Contact</Link>
            {
              user?.role !== "admin" &&
              (
                <Link to="/orders" className="flex flex-col items-center text-[10px] max-[392px]:text-[9px] "><i class="bi bi-box-seam text-lg"></i>Orders</Link>
              )
            }
            {user?.role === "admin" && (
              <Link to="/admin" className="flex flex-col items-center text-[10px] max-[392px]:text-[9px] ">
                <i className="bi bi-shield-lock text-lg"></i>Admin</Link>
            )}
          </div>
            

          {/* Right Side */}
          <div className="flex gap-4 items-center text-sm">
          <i class="bi bi-search cursor-pointer text-lg sm:text-xl" onClick={() => setSearchOpen(true)}></i>
          {
            user?.role !== "admin" &&
            <button onClick={openCart} className="relative cursor-pointer">
              <div className="bg-[#333333] px-[8px] py-1.5 sm:p-3 rounded-full text-white flex items-center hover:opacity-55 hover:transform duration-300">
                <i class="bi bi-cart3 text-[14px]"></i>
                <span className="absolute top-[-4px] right-[-2px] sm:top-1 sm:right-29 bg-[#C09578] text-white text-[10px] px-1 rounded-full">
                  {cart?.items?.length || 0}
                </span>
                <span className="ml-4 hidden sm:inline-block ">
                  Shopping Cart
                </span>
              </div>

            </button>
          }

            {!user ? (
              <>
                <Link to="/login"><span className="hover:text-blue-600 hover:border-b-2 border-blue-600 border-solid duration-150">
                  <i class="bi bi-person "></i>
                  Login</span></Link>
              </>
            ) : (
              <>
                <div className="bg-amber-500 w-9 h-9  sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 hover:transform duration-150 text-gray-900 text-md md:text-xl"
                  onClick={() => navigate("/profile")}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="relative group inline-block">
                  <i className="bi bi-box-arrow-left text-lg sm:text-xl cursor-pointer hover:opacity-70 transition"
                  onClick={logout}></i>

                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 
                                 whitespace-nowrap bg-White text-black text-xs 
                                 px-2 py-1 rounded opacity-0 
                                 group-hover:opacity-100 transition">
                    Logout
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Desktop Bottom Nav */}
      <div className={`hidden md:flex xl:hidden gap-6 text-sm justify-center items-center min-h-16 font-medium ${location.pathname === '/login' || location.pathname === '/register' ? 'hidden' : ''}`}>
        <Link to="/" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Home</Link>
        <Link to="/shop" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Gemstones</Link>
        <Link to="/star" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Birthstone</Link>
        <Link to="/about" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">About Stones</Link>
        <Link to="/contact" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Contact Us</Link>
        {
          user?.role !== "admin" && (
            <Link to="/orders" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Orders</Link>
          )
        }
        {user?.role === "admin" && (
          <Link to="/admin" className="hover:text-gray-700 hover:border-b border-solid border-gray-700 hover:transform duration-150 ">Admin</Link>
        )} </div>
      <CategoryNavBar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      {/* ✅ Search Modal */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)}
        products={products}
      />
    </>
  );
}
