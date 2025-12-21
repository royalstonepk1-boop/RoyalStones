import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/admin/Dashboard";
import ManageProducts from "../pages/admin/ManageProducts";
import ProtectedRoute from "./ProtectedRoute";
import Orders from "../pages/Orders";
import ManageCategories from "../pages/admin/ManageCategories";
import ManageOrders from "../pages/admin/ManageOrders";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Profile from "../pages/Profile";
import DeliveryInfo from "../pages/DeliveryInfo";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";

export default function AppRoutes() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
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
          // <ProtectedRoute>
            <Profile />
          // </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
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
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
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
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute adminOnly={true}>
            <ManageCategories />
          </ProtectedRoute>
        }
      />
    </Routes>
      <Cart />

{/* Wathsapp Icon */}
      <a 
      href={`https://wa.me/923155066472`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-green-500 hover:bg-green-600 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      title="Chat on WhatsApp"
    >
      <i className="bi bi-whatsapp text-2xl md:text-3xl"></i>
    </a>

    </>
  );
}
