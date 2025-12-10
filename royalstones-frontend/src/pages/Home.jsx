import { Link } from "react-router-dom";
import Shop from "./Shop";

export default function Home() {
  return (
    <>
    <div className="relative bg-[url('../images/Home_BG.png')] bg-cover bg-center bg-no-repeat text-white text-center py-24">

      {/* Overlay - stays behind text */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Hero */}
      <div className="relative z-10 py-24">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-wide">
          Luxury Gemstones Collection
        </h1>
        <p className="text-sm sm:text-lg mt-4 text-gray-300">
          Crafted for elegance and royalty
        </p>

        <Link to="/shop">
          <button className="group relative mt-6 bg-white text-black px-8 py-3 text-sm sm:text-[14px] rounded-sm overflow-hidden transition-all duration-300 cursor-pointer">
            <span className="absolute inset-0 bg-gray-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Shop Now
            </span>

          </button>

        </Link>
      </div>

      {/* Features */}
      <div className="relative z-10 grid md:grid-cols-3 gap-6 p-10 text-center">
        <div>
          <h3 className="font-semibold">Certified Stones</h3>
          <p className="text-sm text-gray-300 mt-2">
            100% Authentic & lab tested gemstones
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Fast Shipping</h3>
          <p className="text-sm text-gray-300 mt-2">
            Reliable delivery across Pakistan
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Secure Payments</h3>
          <p className="text-sm text-gray-300 mt-2">
            Safe checkout with Stripe
          </p>
        </div>
      </div>

    </div>
    <Shop/>
    </>

  );
}
