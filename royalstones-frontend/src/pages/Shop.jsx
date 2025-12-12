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
      {categories.map((cat) => {
        const catData = productsByCategory[cat._id] || { items: [], page: 0, finished: false, loading: false };
        console.log(catData)
        return (
          <section key={cat._id} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 id={cat._id} className="text-xl md:text-2xl font-semibold scroll-mt-35">{cat.name}</h2>
              {/* optional: link to view all for this category */}
              {/* <a href={`/category/${cat._id}`} className="text-sm text-indigo-600">View all</a> */}
            </div>
            {
              catData?.loading && catData?.items.length === 0 ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading product...</p>
                </div>) :
                <ProductList
                  products={catData.items}
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
                  {catData.loading ? "Loading..." : "Load more"}
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
