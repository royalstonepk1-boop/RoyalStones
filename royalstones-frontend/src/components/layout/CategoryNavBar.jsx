import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCategories } from "../../api/category.api";
import { fetchFirst6Products } from "../../api/product.api";
import { Link } from "react-router-dom";

export default function CategoryNavBar({ mobileOpen, setMobileOpen }) {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleCategoryClick = (e, catId) => {
    e.preventDefault();

    // Check if we're already on the shop page
    if (location.pathname === '/' || location.pathname === '/shop') {
      // Already on shop page, just scroll
      const element = document.getElementById(catId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to shop page with hash
      navigate(`/#${catId}`);
    }
  };
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
    <div className="bg-white border-b shadow-sm relative w-full z-60 md:sticky md:top-20 ">
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
            <a
              key={cat._id}
              href={`#${cat._id}`}
              onClick={(e) => {setMobileOpen(false); handleCategoryClick(e, cat._id)}}
              className="block px-4 py-2 hover:bg-gray-200 hover:border-l-4 border-gray-800 hover:transform duration-200"
            >
              {cat.name}
            </a>
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
          {categories.length > 0? categories.map((cat) => (
            <a
              key={cat._id}
              href={`#${cat._id}`}
              onClick={(e) => handleCategoryClick(e, cat._id)}
              className="block px-4 py-2 hover:bg-gray-200 hover:border-l-4 border-gray-800 hover:transform duration-200"
            >
              {cat.name}
            </a>
          )) :
          <span className="flex justify-center items-center p-1">No Categories found</span>
          }
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
                to={`/product/${prod._id}`}
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
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Helper to close when a menu item is clicked
  function handleMenuClick(e) {
    // If you want to allow clicks on elements that shouldn't close the menu,
    // add logic here. By default we close on any click inside the menu.
    setOpen(false);
  }

  return (
    <div
      ref={ref}
      className="relative z-20"
      onMouseLeave={() => setOpen(false)} // hide on mouse leave
      onMouseEnter={() => setOpen(true)} // show on hover
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)} // toggle on click
        className="text-gray-700 hover:text-black transition"
        onKeyDown={(e) => {
          // open with ArrowDown or Enter/Space
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {title}
      </button>

      <div
        className={`absolute left-0 top-8 mt-2 w-64 bg-white border rounded-lg shadow-lg transition-all duration-300
          ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"}`}
      >
        {children ? (
          // clicking any child will close the menu
          <div
            className="py-2 max-h-80 overflow-y-auto custom-scroll"
            onClick={handleMenuClick}
            role="menu"
          >
            {children}
          </div>
        ) : (
          <span className="flex justify-center items-center p-3">No item found</span>
        )}
      </div>
    </div>
  );
}

