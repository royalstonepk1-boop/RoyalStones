import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const { product, getProductById, loading } = useProductStore();
  const user = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.addToCart);
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user) {
      return navigate("/login");
    }
    await addToCart(product._id, 1);
    alert("Added to Cart!");
  };

  useEffect(() => {
    getProductById(id);
  }, [id]);

  if (loading || !product) return <p>Loading...</p>;

  const image = product.images?.[0]?.url;

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <img
        src={image}
        className="w-full h-96 object-cover rounded"
      />

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="my-3">{product.description}</p>
        <p className="text-xl font-semibold">Rs {product.price}</p>

        <button
          className="bg-black text-white px-6 py-2 mt-4"
          onClick={handleAdd}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
