import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
