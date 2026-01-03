import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCategories } from "../../api/category.api";
import { fetchFirst6Products } from "../../api/product.api";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useProductStore } from "../../store/productStore";

export default function CategoryNavBar({ mobileOpen, setMobileOpen }) {
  const [categories, setCategories] = useState([]);
  const {productsByCategory} =useProductStore();
  const [productsByCategory1, setProductsByCategory1] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeNested, setActiveNested] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleCategoryClick = (e, catId) => {
    e.preventDefault();

    if (location.pathname === '/' || location.pathname === '/shop') {
      const element = document.getElementById(catId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(`/#${catId}`);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      const firstFour = categories.filter(cat => !cat.parentId).slice(0, 4);

      for (const cat of firstFour) {
        const subCats = categories.filter(c => c.parentId === cat._id);

        if (subCats.length > 0) {
          for (const sub of subCats) {
            try {
              const res = await fetchFirst6Products(sub._id);
              setProductsByCategory1((prev) => ({
                ...prev,
                [sub._id]: res.data,
              }));
            } catch (err) {
              console.log(err);
            }
          }
        } else {
          try {
            const res = await fetchFirst6Products(cat._id);
            setProductsByCategory1((prev) => ({
              ...prev,
              [cat._id]: res.data,
            }));
          } catch (err) {
            console.log(err);
          }
        }
      }
    };

    if (categories.length > 0) loadProducts();
  }, [categories]);

  const parentCategories = categories.filter(cat => !cat.parentId);
  const firstFourCategories = parentCategories.slice(0, 4);

  return (
    <div className={`bg-white shadow-sm relative w-full md:sticky md:top-20  ${location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin' ? 'hidden' : ''}`} style={{ zIndex: 100 }}>
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40"
          style={{ zIndex: 98 }}
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Left Drawer */}
      <div
        className={`fixed top-0 left-0 h-full max-w-[50%] bg-white transform transition-transform duration-300
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ zIndex: 99 }}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setMobileOpen(false)}>
            <i className="bi bi-x-lg cursor-pointer"></i>
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          {categories
            .filter(cat => cat.parentId !== null)
            .filter((cat) => productsByCategory[cat._id]?.items?.length > 0) // Only show categories with loaded products
          .sort((a, b) => {
            const aCount = (productsByCategory[a._id]?.items || []).length;
            const bCount = (productsByCategory[b._id]?.items || []).length;
            return bCount - aCount;
          })
            .map((cat) => (
              <a
                key={cat._id}
                href={`#${cat._id}`}
                onClick={(e) => { setMobileOpen(false); handleCategoryClick(e, cat._id) }}
                className="block px-4 py-2 break-words hover:bg-gray-200 hover:border-l-4 border-gray-800 hover:transform duration-200"
              >
                {cat.name.length > 30 ? cat.name.slice(0,30)+'...' : cat.name}
              </a>
            ))}
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden md:flex max-h-2xl mx-auto gap-2 text-[12px] sm:gap-10 md:gap-16 lg:gap-20 min-[939px]:text-[16px] justify-center items-center px-6 py-3 font-medium">

        {/* ALL CATEGORIES */}
        <Dropdown
          id="all"
          title={
            <span className="flex items-center gap-1">
              <i className="bi bi-ui-checks-grid"></i>
              All Categories
              <i className="bi bi-chevron-down"></i>
            </span>
          }
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        >
          {categories.length > 0 ? (
            parentCategories.map(parent => {
              const subCategories = categories.filter(child => child.parentId === parent._id);

              return (
                <NestedMenuItem
                  id={parent._id}
                  key={parent._id}
                  label={parent.name}
                  href={`#${parent._id}`}
                  onClick={(e) => handleCategoryClick(e, parent._id)}
                  hasNested={subCategories.length > 0}
                  activeNested={activeNested}
                  setActiveNested={setActiveNested}
                >
                  {subCategories.map(child => (
                    <a
                      key={child._id}
                      href={`#${child._id}`}
                      onClick={(e) => { handleCategoryClick(e, child._id) }}
                      className="block px-4 py-2 hover:bg-gray-100 hover:border-l-4 border-gray-800 transition duration-200"
                    >
                      {child.name.length > 20 ? child.name.slice(0,20)+'...' : child.name}
                    </a>
                  ))}
                </NestedMenuItem>
              );
            })
          ) : (
            <span className="flex justify-center items-center p-2">No Categories found</span>
          )}
        </Dropdown>

        {/* First 4 Categories */}
        {firstFourCategories.map((parent) => {
          const subCategories = categories.filter(c => c.parentId === parent._id);

          return (
            <Dropdown
              id={parent._id}
              key={parent._id}
              title={
                <span className="flex items-center gap-1">
                  {parent.name.length > 15 ? parent.name.slice(0,15)+'...' : parent.name}
                  <i className="bi bi-chevron-down"></i>
                </span>
              }
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            >
              {subCategories.length > 0 ? (
                subCategories.map(sub => (
                  <NestedMenuItem
                    id={sub._id}
                    key={sub._id}
                    label={sub.name}
                    href={`#${sub._id}`}
                    onClick={(e) => handleCategoryClick(e, sub._id)}
                    hasNested={productsByCategory1[sub._id]?.length > 0}
                    activeNested={activeNested}
                    setActiveNested={setActiveNested}
                  >
                    {productsByCategory1[sub._id]?.map(prod => (
                      <Link
                        key={prod._id}
                        to={`/product/${prod._id}`}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition duration-150 hover:border-l-4 border-gray-800 max-w-[200px]"
                      >
                        <img
                          src={prod.images?.[0]?.url}
                          alt={prod.name}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                        <span className="text-sm break-words min-w-[70%]">{prod.name.length > 20 ? prod.name.slice(0,20)+'...' : prod.name}</span>
                      </Link>
                    ))}
                  </NestedMenuItem>
                ))
              ) : (
                productsByCategory1[parent._id]?.map(prod => (
                  <Link
                    key={prod._id}
                    to={`/product/${prod._id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 transition duration-150 hover:border-l-4 border-gray-800"
                  >
                    <img
                      src={prod.images?.[0]?.url}
                      alt={prod.name}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    <span className="text-sm break-words min-w-[70%]">{prod.name.length > 20 ? prod.name.slice(0,20)+'...' : prod.name}</span>
                  </Link>
                ))
              )}
            </Dropdown>
          );
        })}
      </div>
    </div>
  );
}

/* Nested Menu Item with Portal */
function NestedMenuItem({
  id,
  label,
  hasNested,
  activeNested,
  setActiveNested,
  children
}) {
  const itemRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (activeNested === id && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.right + 0
      });
    }
  }, [activeNested, id]);

  return (
    <>
      <div
        ref={itemRef}
        onMouseEnter={() => hasNested && setActiveNested(id)}
        className="block px-4 py-2 font-semibold cursor-pointer
                   hover:bg-gray-200 hover:border-l-4 border-gray-800"
      >
        {label.length > 20 ? label.slice(0,20)+'...' : label}
      </div>

      {hasNested && activeNested === id &&
        createPortal(
          <div
            className="fixed bg-white shadow-xl border rounded-lg
                       min-w-[240px] max-h-[500px] overflow-y-auto"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 1000
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseLeave={() => hasNested && setActiveNested(null)}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}


/* Dropdown Component */
function Dropdown({ id, title, children, activeDropdown, setActiveDropdown }) {
  const open = activeDropdown === id;
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function handleDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        // setOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") {
        // setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // const handleMouseEnter = () => {
  //   if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //   setOpen(true);
  // };

  // const handleMouseLeave = () => {
  //   timeoutRef.current = setTimeout(() => setOpen(false), 150);
  // };

  return (
    <div
      ref={ref}
      className={`relative`}
      onMouseEnter={() => setActiveDropdown(id)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        // onClick={() => setOpen((s) => !s)}
        className="text-gray-700 hover:text-black transition whitespace-nowrap"
      >
        {title}
      </button>

      {open && (
        <div
          className="absolute left-0 top-4 mt-2 bg-white border rounded-lg shadow-xl min-w-[220px]"
          style={{ zIndex: 10001 }}
          onMouseEnter={() => {
            setActiveDropdown(id);
            // setActiveNested(null); // ⭐ VERY IMPORTANT
          }}
        >
          <div className="py-2 max-h-[500px] overflow-y-auto custom-scroll" role="menu">
            {children?.length>0 ? children : <span className="flex justify-center items-center p-3">No item found</span>}
          </div>
        </div>
      )}
    </div>
  );
}