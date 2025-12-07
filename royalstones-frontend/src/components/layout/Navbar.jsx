import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const cart = useCartStore((s) => s.cart);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Royal<span className="text-gray-600">Stones</span>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/orders">Orders</Link>
          {user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex gap-4 items-center text-sm">
          <Link to="/cart" className="relative">
            🛒
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1 rounded-sm">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <span>Hi, {user.email}</span>
          )}
        </div>
      </div>
    </nav>
  );
}
