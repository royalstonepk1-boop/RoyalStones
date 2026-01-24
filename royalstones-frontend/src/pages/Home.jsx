import { Link } from "react-router-dom";
import Shop from "./Shop";
import PageWrapper from "../util/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
    <div className="relative bg-cover bg-center bg-no-repeat text-white text-center py-24 min-h-screen"
         style={{ backgroundImage: `url(https://res.cloudinary.com/dox58sidi/image/upload/v1769200637/Screenshot_2026-01-24_005216_tenmnn.png)` }}>

      {/* Overlay - stays behind text */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero */}
      <div className="relative z-10 pb-24 pt-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide">
          PAKISTAN BIGGEST CERTIFIED
        </h1>
        <p className="text-4xl sm:text-6xl md:text-9xl mt-4 text-gray-300">
          GEMSTONE BRAND
        </p>

        <Link to="/shop">
          <button className="group relative mt-18 bg-white text-black px-9 py-4 text-sm sm:text-[14px] rounded-sm overflow-hidden transition-all duration-300 cursor-pointer">
            <span className="absolute inset-0 bg-gray-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Shop Now
            </span>

          </button>

        </Link>
      </div>

      {/* Features */}
      {/* <div className="relative z-10 grid md:grid-cols-3 gap-6 p-10 text-center">
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
      </div> */}

    </div>
    <Shop/>
    </PageWrapper>

  );
}
