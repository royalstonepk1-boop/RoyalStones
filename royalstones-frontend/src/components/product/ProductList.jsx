import ProductCard from "./ProductCard";

export default function ProductList({ products = [] }) {
  if (!products || products.length === 0) {
    return <p className="text-sm text-gray-500">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
