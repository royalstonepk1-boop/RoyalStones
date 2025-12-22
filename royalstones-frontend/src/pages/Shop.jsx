import { useEffect, useState,useRef } from "react";
import { useLocation ,useNavigate} from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { fetchCategories } from "../api/category.api";
import ProductList from "../components/product/ProductList";
import PageWrapper from "../util/PageWrapper";

export default function Shop() {
  const { productsByCategory, getProductsByCategory, loading, getProducts } = useProductStore();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const hasScrolled = useRef(false);
  const [priceSort, setPriceSort] = useState(""); 
  

  // global products if you still need them for other usage
  useEffect(() => {
    getProducts(search, categoryFilter);
  }, [search, categoryFilter, getProducts]);

  useEffect(() => {
    // Reset scroll flag when location changes
    hasScrolled.current = false;
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash && !hasScrolled.current) {
      const id = location.hash.replace('#', '');
      
      // Wait for all content to load
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          hasScrolled.current = true;
          
          // Remove hash from URL after scrolling
          navigate(location.pathname, { replace: true });
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname, navigate]);
  
  // load categories once
  useEffect(() => {
    fetchCategories()
      .then((res) => {
        const cats = res.data || [];
        setCategories(cats);

        // once categories are available, load first 6 for each category
        cats.forEach((c) => {
          getProductsByCategory(c._id, { append: false });
        });
      })
      .catch((err) => {
        console.error("Category error", err);
      });
  }, [getProductsByCategory]);

  const sortProductsByPrice = (products) => {
    if (!priceSort) return products;
    
    const sorted = [...products].sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      
      if (priceSort === "low") {
        return priceA - priceB; // Low to High
      } else if (priceSort === "high") {
        return priceB - priceA; // High to Low
      }
      return 0;
    });
    
    return sorted;
  };

  return (
    <PageWrapper>
    <div className="p-6">
      <h1 className="text-xl md:text-2xl font-extrabold my-2 text-center">New Arrival</h1>
      <p className="text-3xl md:text-4xl text-gray-600 mb-6 text-center">Latest Gemstone Collection</p>

      {/* If you want a search box in future: */}
      {/* <div className="mb-4">
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search products..." className="border rounded px-3 py-2 w-full" />
      </div> */}
      
      {/* Render per-category sections */}
      { 
        (!productsByCategory || Object.keys(productsByCategory).length === 0) &&
        <div className="text-center pt-10">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
      }
      {categories
      .filter((cat) => cat.parentId !== null)
      .map((cat) => {
        const catData = productsByCategory[cat._id] || { items: [], page: 0, finished: false, loading: false };
        const sortedProducts = sortProductsByPrice(catData.items);
        // console.log("Category Data for", cat.name, catData);
        return (
          <section key={cat._id} className="mb-10">
            <div className="flex flex-row justify-between items-center mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 id={cat._id} className="text-xl md:text-2xl font-semibold scroll-mt-35">{cat.name}</h2>
              {/* optional: link to view all for this category */}
              {/* <a href={`/category/${cat._id}`} className="text-sm text-indigo-600">View all</a> */}
            </div>
            <div className="mb-6 flex justify-center">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by Price
            </label>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="block w-52 px-4 py-2 pr-8 border cursor-pointer border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Default</option>
              <option value="low">Low to High</option>
              <option value="high">High to Low</option>
            </select>
          </div>
          </div>
            </div>
            
            {
              catData?.loading && catData?.items.length === 0 ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading product...</p>
                </div>) :
                <ProductList
                  products={sortedProducts}
                />
            }

            

            <div className="mt-4 flex justify-center">
              {/* show load more only if we fetched at least `limit` (6) items in last fetch (i.e., not finished) */}
              {!catData.finished && (catData.items.length > 0) ? (
                <button
                  onClick={() => getProductsByCategory(cat._id, { append: true })}
                  disabled={catData.loading}
                  className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100"
                >
                  {catData.loading ? <div className="w-25"> <p className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></p></div> : "Load more"}
                </button>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
    </PageWrapper>
  );
}
