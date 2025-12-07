import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-black text-white text-center py-24">
        <h1 className="text-4xl font-bold tracking-wide">
          Luxury Gemstones Collection
        </h1>
        <p className="text-sm mt-4 text-gray-300">
          Crafted for elegance and royalty
        </p>

        <Link to="/shop">
          <button className="mt-6 bg-white text-black px-8 py-3 text-sm">
            Shop Now
          </button>
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 p-10 text-center">
        <div>
          <h3 className="font-semibold">Certified Stones</h3>
          <p className="text-sm text-gray-500 mt-2">
            100% Authentic & lab tested gemstones
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Fast Shipping</h3>
          <p className="text-sm text-gray-500 mt-2">
            Reliable delivery across Pakistan
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Secure Payments</h3>
          <p className="text-sm text-gray-500 mt-2">
            Safe checkout with Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
