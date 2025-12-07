import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "../store/cartStore";
import { createStripeSession } from "../api/order.api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const { cart } = useCartStore();

  const payNow = async () => {
    const stripe = await stripePromise;

    const res = await createStripeSession({
      items: cart.items.map((it) => ({
        name: it.productId.name,
        price: it.productId.price,
        quantity: it.quantity,
      })),
    });

    await stripe.redirectToCheckout({ sessionId: res.data.id });
  };

  if (!cart) return <p>Loading...</p>;

  const total = cart.items.reduce(
    (sum, i) => sum + i.productId.price * i.quantity,
    0
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p className="mb-4 font-semibold">Total: Rs {total}</p>

      <button
        className="bg-black text-white px-6 py-3"
        onClick={payNow}
      >
        Pay with Stripe
      </button>
    </div>
  );
}
