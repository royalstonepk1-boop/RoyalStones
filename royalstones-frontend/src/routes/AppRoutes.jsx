import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Orders from "../pages/Orders";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Profile from "../pages/Profile";
import DeliveryInfo from "../pages/DeliveryInfo";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import ChatWidget from "../pages/ChatWidget";
import NotFound from "../pages/NotFound";
import AdminApp from "../pages/admin/AdminApp";
import { useLocation } from 'react-router-dom';
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import ZodiacShop from "../pages/ZodiacShop";

export default function AppRoutes() {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/star" element={<ZodiacShop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/delivery" element={<DeliveryInfo />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      /> */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
            <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout-success"
          element={
            <ProtectedRoute>
            <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cancel"
          element={
            <ProtectedRoute>
            <PaymentCancel />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminApp />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly={true}>
              <ManageProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <ManageOrders />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/checkout"
          element={
              <Checkout />
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/admin/categories"
          element={
            <ProtectedRoute adminOnly={true}>
              <ManageCategories />
            </ProtectedRoute>
          }
        /> */}

        {/* 404 - Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Cart />

      {/* Wathsapp Icon */}
      <a
        href={`https://wa.me/923155066472`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${(location.pathname === '/login' || location.pathname === '/register') && 'hidden' } fixed bottom-20 right-19 md:bottom-6 md:right-22 bg-green-500 hover:bg-green-600 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50`}
        title="Chat on WhatsApp"
      >
        <i className="bi bi-whatsapp text-2xl md:text-3xl"></i>
      </a>

      {/* Chat Widget - replaces WhatsApp icon */}
      <ChatWidget />

    </>
  );
}
