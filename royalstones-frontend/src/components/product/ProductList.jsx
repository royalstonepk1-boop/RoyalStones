import ProductCard from "./ProductCard";

export default function ProductList({ products = [] ,catData=[] ,getProductsByCategory ,cat}) {
  if (!products || products.length === 0) {
    return <p className="text-sm text-gray-500">No products found.</p>;
  }
  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollWidth - el.scrollLeft <= el.clientWidth + 50) {
      if (!catData.loading && !catData.finished) {
        getProductsByCategory(cat._id, { append: true });
        // console.log('scroll works')
      }
    }
  };
  

  return (
    <div className="flex gap-7 overflow-x-auto scrollbar-light py-2 w-auto" onScroll={handleScroll}>
      {products.map((p) => (
          <ProductCard key={p._id} product={p} products={products} catData={catData} cat={cat} />
      ))}
    </div>
  );
}
