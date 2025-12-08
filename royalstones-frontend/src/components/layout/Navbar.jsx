import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import SubNavBar from "./SubNavBar";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const cart = useCartStore((s) => s.cart);

  return (
    <>
      <SubNavBar />
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wide">
            Royal<span className="text-gray-600">Stones</span>
          </Link>

          {/* Menu
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/orders">Orders</Link>
          {user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}
        </div> */}
          <div className="hidden md:flex items-center bg-white/70 backdrop-blur-md border border-gray-400 rounded-full px-6 py-2 w-74">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400"
            />
            <i class="bi bi-search"></i>
          </div>

          {/* Right Side */}
          <div className="flex gap-4 items-center text-sm">
            <Link to="/cart" className="relative">
              <div className="bg-[#333333] px-[10px] py-2 sm:p-3 rounded-full text-white flex items-center hover:opacity-55 hover:transform duration-300">
                <i class="bi bi-cart3 text-[14px]"></i>
                <span className="absolute top-0 right-0 sm:top-1 sm:right-29 bg-[#C09578] text-white text-[10px] px-1 rounded-full">
                  {cart?.items?.length || 0}
                </span>
                <span className="ml-4 hidden sm:inline-block ">
                  Shopping Cart
                </span>
              </div>

            </Link>

            {!user ? (
              <>
                <Link to="/login"><span className="hover:text-blue-600 hover:border-b-2 border-blue-600 border-solid duration-150">
                  <i class="bi bi-person "></i>
                  Login</span></Link>
              </>
            ) : (
              <span>Hi, {user.email}</span>
            )}
          </div>
        </div>
      </nav>
      <div className="flex items-center md:hidden bg-white/70 backdrop-blur-md border border-gray-400 rounded-full px-6 py-2 my-6 w-[100%]">
        <input
          type="text"
          placeholder="Search products..."
          className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400"
        />
        <i class="bi bi-search"></i>
      </div>
    </>
  );
}
