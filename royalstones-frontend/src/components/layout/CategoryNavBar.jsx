import { useEffect, useState } from "react";
import { fetchCategories } from "../../api/category.api";
import { fetchFirst6Products } from "../../api/product.api";
import { Link } from "react-router-dom";

export default function CategoryNavBar({mobileOpen, setMobileOpen}) {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const firstFour = categories.slice(0, 4);

      for (const cat of firstFour) {
        try {
          const res = await fetchFirst6Products(cat._id);
          setProductsByCategory((prev) => ({
            ...prev,
            [cat._id]: res.data,
          }));
        } catch (err) {
          console.log(err);
        }
      }
    };

    if (categories.length > 0) loadProducts();
  }, [categories]);

  const firstFourCategories = categories.slice(0, 4);

  return (
    <div className="bg-white border-b shadow-sm relative w-full ">
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Left Drawer (40%) */}
      <div
        className={`fixed top-0 left-0 h-full w-[40%] bg-white z-50 transform transition-transform duration-300
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setMobileOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="p-4 space-y-3">
          {categories?.map((cat) => (
            <Link
              key={cat._id}
              // to={`/shop?category=${cat._id}`}
              className="block py-2 border-b text-sm hover:bg-gray-200 hover:border-b-4 border-gray-800"
              onClick={() => setMobileOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden md:flex max-h-2xl mx-auto gap-2 text-[12px] sm:gap-10 md:gap-16 lg:gap-20 min-[939px]:text-[16px] justify-center items-center px-6 py-3 font-medium">
        {/* ALL CATEGORIES */}
        <Dropdown
          title={
            <span className="flex items-center gap-1">
              <i className="bi bi-ui-checks-grid"></i>
              All Categories
              <i className="bi bi-chevron-down"></i>
            </span>
          }
        >
          {categories.map((cat) => (
            <Link
              key={cat._id}
              className="block px-4 py-2 hover:bg-gray-200 hover:border-l-4 border-gray-800 hover:transform duration-200"
            >
              {cat.name}
            </Link>
          ))}
        </Dropdown>

        {/* First 4 Categories Dropdowns */}
        {firstFourCategories.map((cat) => (
          <Dropdown
            key={cat._id}
            title={
              <span className="flex items-center gap-1">
                {cat.name}
                <i className="bi bi-chevron-down"></i>
              </span>
            }
          >
            {productsByCategory[cat._id]?.map((prod) => (
              <Link
                key={prod._id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 hover:border-l-4 border-gray-800 hover:transform duration-200"
              >
                <img
                  src={prod.images?.[0]?.url}
                  alt={prod.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-sm hover:opacity-55">
                  {prod.name}
                </span>
              </Link>
            ))}
          </Dropdown>
        ))}
      </div>
    </div>
  );
}

/* Dropdown Component */
function Dropdown({ title, children }) {
  return (
    <div className="group relative z-20">
      <button className="text-gray-700 hover:text-black transition">
        {title}
      </button>

      <div className="absolute left-0 top-7 mt-2 w-64 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
        <div className="py-2 max-h-80 overflow-y-auto">{children? children:"No item found"}</div>
      </div>
    </div>
  );
}
