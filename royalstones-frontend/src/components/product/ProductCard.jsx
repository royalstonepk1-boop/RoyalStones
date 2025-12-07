import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.url;

  return (
    <div className="border p-3 rounded hover:shadow">
      <Link to={`/product/${product._id}`}>
        <img
          src={image}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
        <h3 className="mt-2 font-semibold">{product.name}</h3>
        <p className="text-gray-500">Rs {product.price}</p>
      </Link>
    </div>
  );
}
