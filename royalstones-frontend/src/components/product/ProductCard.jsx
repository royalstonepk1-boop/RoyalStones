import { useState, useEffect } from "react";
import { Link ,useNavigate  } from "react-router-dom";


export default function ProductCard({ product ,products, catData, cat}) {
  const primary = product.images?.[0]?.url || "/images/placeholder.png";
  const secondary = product.images?.[1]?.url || null;
  const name = product.name || "Unnamed";
  const price = typeof product.price === "number" ? product.price : product.price || "—";
  const discount = product.discountPrice;
  const stock = product.stockQuantity ?? 0;
  const carret = product.carretRate?.min || 1;

  const navigate = useNavigate();

  const [hovered, setHovered] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);

  // Preload secondary image for smooth transition
  useEffect(() => {
    if (!secondary) return;
    const img = new Image();
    img.src = secondary;
    img.onload = () => setSecondaryLoaded(true);
    img.onerror = () => setSecondaryLoaded(false);
  }, [secondary]);

  // action handlers (replace with real cart logic)
  // const handleAddToCart = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   console.log("Add to cart", product._id);
  // };

  // const handleBuyNow = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   console.log("Buy now", product._id);
  // };
  // useEffect(() => {
  //   console.log(product);
  // }, [product])
  

  return (
    <div
      className="border rounded-lg overflow-hidden bg-white min-w-[200px] min-h-[350px] max-w-[200px] max-h-[350px]  md:min-w-[300px] md:min-h-[400px] md:max-w-[300px] md:max-h-[400px] hover:shadow-lg transition-shadow group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button onClick={() =>{
        navigate(`/product/${product._id}`, {
          state: {
              products: products,
              catData: catData,
              cat: cat
          }
        })}
      } className="inline-block w-full text-left cursor-pointer">
        <div className="relative w-full h-48 sm:h-54 md:h-68 bg-gray-50">
          {/* Image stack: primary below, secondary above.
              We animate opacity + transform for a crossfade + subtle zoom effect. */}
          <img
            src={primary}
            alt={name}
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out transform-gpu ${
              hovered && secondary && secondaryLoaded ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          />

          {secondary ? (
            <img
              src={secondary}
              alt={name + " alternate"}
              draggable={false}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-600 ease-in-out transform-gpu ${
                hovered && secondaryLoaded ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-105 -translate-y-1"
              }`}
            />
          ) : null}

          {/* {discount ? (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Sale</span>
          ) : null} */}

          {/* Hover overlay with buttons */}
          <div
            className={`absolute inset-0 flex items-end justify-center p-3 pointer-events-none transition-opacity duration-200 ${
              hovered ? "md:opacity-100" : "md:opacity-0"
            }`}
            aria-hidden={!hovered}
          >
            {
              stock === 0 ?'':
              <div className="w-full flex gap-2 justify-end pointer-events-auto">
              {/* <button
                onClick={handleAddToCart}
                className="px-3 py-2 border rounded text-sm font-medium shadow-sm text-black bg-white hover:bg-[#333333] hover:text-white hover:cursor-pointer hover:transform duration-150"
                aria-label={`Add ${name} to cart`}
              >
                <i class="bi bi-cart-check text-xl md:text-2xl"></i>
              </button> */}
              {/* <button
                onClick={handleBuyNow}
                className="px-3 py-2 bg-indigo-600 text-white rounded text-sm font-medium shadow-sm hover:bg-indigo-700"
                aria-label={`Buy ${name} now`}
              >
                Buy now
              </button> */}
            </div>
            }
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-sm md:text-base font-medium whitespace-normal break-words">
            {name.length > 55 ? name.slice(0, 55) + "..." : name}
          </h3>


          <div className="mt-2 flex items-baseline gap-2">
            {discount ? (
              <>
                <span className="text-sm md:text-base font-semibold">Rs {discount*carret}</span>
                <span className="text-xs line-through text-gray-400">Rs {price*carret}</span>
              </>
            ) : (
              <span className="text-sm md:text-base font-semibold">Rs {price*carret}</span>
            )}
          </div>

          <p className="mt-2 text-xs text-gray-500">{stock === 0 ?<span className="text-red-500">Out of stock</span>:<span>In stock: {stock}</span>}</p>
        </div>
      </button>
    </div>
  );
}
