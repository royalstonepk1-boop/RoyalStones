import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, fetchCart, removeFromCart, loading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p>Loading cart...</p>;
  if (!cart || cart.items.length === 0)
    return <p>Your cart is empty</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Your Cart</h1>

      {cart.items.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          onRemove={removeFromCart}
        />
      ))}

      {/* ✅ Summary belongs here */}
      <CartSummary cart={cart} />

      <Link to="/checkout">
        <button className="bg-black text-white px-6 py-3 mt-6 w-full">
          Proceed to Checkout
        </button>
      </Link>
    </div>
  );
}
