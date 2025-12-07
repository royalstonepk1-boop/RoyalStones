import { useEffect, useState } from "react";
import { useProductStore } from "../store/productStore";
import { fetchCategories } from "../api/category.api";
import ProductList from "../components/product/ProductList";
import CategoryFilter from "../components/product/CategoryFilter";

export default function Shop() {
  const { products, getProducts, loading } = useProductStore();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getProducts(search, category);
  }, [search, category]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("data is");
        const res = await fetchCategories();
        setCategories(res.data);
        console.log(res.data,"data is");
      } catch (err) {
        console.error("Category error", err);
      }
    };
  
    loadCategories();
  }, []);
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shop</h1>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search products..."
          className="border p-2 w-60"
          onChange={(e) => setSearch(e.target.value)}
        />

        <CategoryFilter
          categories={categories}
          onSelect={(val) => setCategory(val)}
        />
      </div>

      {/* Products */}
      {loading ? <p>Loading...</p> : <ProductList products={products} />}
    </div>
  );
}
