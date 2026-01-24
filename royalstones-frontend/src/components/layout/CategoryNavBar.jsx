import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCategories } from "../../api/category.api";
import { fetchFirst6Products } from "../../api/product.api";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useProductStore } from "../../store/productStore";

export default function CategoryNavBar({ mobileOpen, setMobileOpen }) {
  const [categories, setCategories] = useState([]);
  const { productsByCategory } = useProductStore();
  const [productsByCategory1, setProductsByCategory1] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeNested, setActiveNested] = useState(null);
  const [mobileActiveParent, setMobileActiveParent] = useState(null);
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);
  const [mobileProducts, setMobileProducts] = useState([]);
  const [loadingMobileProducts, setLoadingMobileProducts] = useState(false);
  const [mobileView, setMobileView] = useState('parents');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleMobileParentClick = (parent) => {
    const subCategories = categories.filter(c => c.parentId === parent._id);

    if (subCategories.length > 0) {
      // Has subcategories, show them
      setMobileActiveParent(parent);
      setMobileView('subcategories');
    } else {
      // No subcategories, load products directly
      setMobileActiveParent(parent);
      setMobileActiveCategory(parent._id);
      setLoadingMobileProducts(true);
      setMobileView('products');

      const products = productsByCategory[parent._id]?.items || [];
      setMobileProducts(products);
      setLoadingMobileProducts(false);
    }
  };

  const handleMobileSubcategoryClick = (subcat) => {
    setMobileActiveCategory(subcat._id);
    setLoadingMobileProducts(true);
    setMobileView('products');

    const products = productsByCategory[subcat._id]?.items || [];
    setMobileProducts(products);
    setLoadingMobileProducts(false);
  };

  const handleMobileProductClick = (productId) => {
    const selectedCategory = categories.find(c => c._id === mobileActiveCategory);

    setMobileOpen(false);
    setMobileActiveParent(null);
    setMobileActiveCategory(null);
    setMobileProducts([]);
    setMobileView('parents');

    navigate(`/product/${productId}`, {
      state: {
        products: mobileProducts,
        catData: productsByCategory[mobileActiveCategory],
        cat: selectedCategory
      }
    });
  };

  const handleBackToParents = () => {
    setMobileActiveParent(null);
    setMobileActiveCategory(null);
    setMobileProducts([]);
    setMobileView('parents');
  };

  const handleBackToSubcategories = () => {
    setMobileActiveCategory(null);
    setMobileProducts([]);
    setMobileView('subcategories');
  };

  // Get parent categories that have products
  const getParentCategoriesWithProducts = () => {
    return categories
      .filter(cat => !cat.parentId)
      .filter(parent => {
        // Check if parent itself has products
        if (productsByCategory[parent._id]?.items?.length > 0) return true;

        // Check if any subcategory has products
        const subCats = categories.filter(c => c.parentId === parent._id);
        return subCats.some(sub => productsByCategory[sub._id]?.items?.length > 0);
      })
      .sort((a, b) => {
        // Sort by total product count (parent + all subcategories)
        const getProductCount = (parentCat) => {
          let count = (productsByCategory[parentCat._id]?.items || []).length;
          const subs = categories.filter(c => c.parentId === parentCat._id);
          subs.forEach(sub => {
            count += (productsByCategory[sub._id]?.items || []).length;
          });
          return count;
        };
        return getProductCount(b) - getProductCount(a);
      });
  };

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
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => {
              setMobileOpen(false);
              setMobileView('parents');
              setMobileActiveParent(null);
              setMobileActiveCategory(null);
            }}
            className="text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Mobile Content */}
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {mobileView === 'parents' && (
            // Show Parent Categories
            <>
              {getParentCategoriesWithProducts().map((parent) => (
                <button
                  key={parent._id}
                  onClick={() => handleMobileParentClick(parent)}
                  className="w-full text-left px-4 py-2 break-words hover:bg-gray-200 hover:border-l-4 border-gray-800 hover:transform duration-200 flex justify-between items-center"
                >
                  <span>
                    {parent.name.length > 30 ? parent.name.slice(0, 30) + '...' : parent.name}
                  </span>
                  <span className="text-gray-400">›</span>
                </button>
              ))}
            </>
          )}

          {mobileView === 'subcategories' && mobileActiveParent && (
            // Show Subcategories
            <>
              <button
                onClick={handleBackToParents}
                className="w-full text-left px-4 py-3 border-b hover:bg-gray-100 flex items-center gap-2 font-semibold sticky top-0 bg-white z-10"
              >
                <span>‹</span>
                <span>Back to Categories</span>
              </button>

              {categories
                .filter(c => c.parentId === mobileActiveParent._id)
                .filter(subcat => productsByCategory[subcat._id]?.items?.length > 0)
                .sort((a, b) => {
                  const aCount = (productsByCategory[a._id]?.items || []).length;
                  const bCount = (productsByCategory[b._id]?.items || []).length;
                  return bCount - aCount;
                })
                .map((subcat) => (
                  <button
                    key={subcat._id}
                    onClick={() => handleMobileSubcategoryClick(subcat)}
                    className="w-full text-left px-4 py-2 break-words hover:bg-gray-200 hover:border-l-4 border-gray-800 hover:transform duration-200 flex justify-between items-center"
                  >
                    <span>
                      {subcat.name.length > 30 ? subcat.name.slice(0, 30) + '...' : subcat.name}
                    </span>
                    <span className="text-gray-400">›</span>
                  </button>
                ))}
            </>
          )}

          {mobileView === 'products' && (
            // Show Products
            <>
              <button
                onClick={mobileActiveParent && categories.filter(c => c.parentId === mobileActiveParent._id).length > 0
                  ? handleBackToSubcategories
                  : handleBackToParents}
                className="w-full text-left px-4 py-3 border-b hover:bg-gray-100 flex items-center gap-2 font-semibold sticky top-0 bg-white z-10"
              >
                <span>‹</span>
                <span>
                  {mobileActiveParent && categories.filter(c => c.parentId === mobileActiveParent._id).length > 0
                    ? 'Back to Subcategories'
                    : 'Back to Categories'}
                </span>
              </button>

              {loadingMobileProducts ? (
                <div className="p-4 text-center text-gray-500">Loading products...</div>
              ) : mobileProducts.length > 0 ? (
                mobileProducts.map((prod) => (
                  <button
                    key={prod._id}
                    onClick={() => handleMobileProductClick(prod._id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 hover:border-l-4 border-gray-800 transition duration-200 border-b"
                  >
                    {prod.name.length > 30 ? prod.name.slice(0, 30) + '...' : prod.name}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No products found</div>
              )}
            </>
          )}
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
                      {child.name.length > 20 ? child.name.slice(0, 20) + '...' : child.name}
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
                  {parent.name.length > 15 ? parent.name.slice(0, 15) + '...' : parent.name}
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
                      <button
                        key={prod._id}
                        onClick={() => {
                          const currentCategory = categories.find(c => c._id === sub._id);
                          const allProducts = productsByCategory1[sub._id] || [];

                          navigate(`/product/${prod._id}`, {
                            state: {
                              products: allProducts,
                              catData: productsByCategory[sub._id] || { items: allProducts },
                              cat: currentCategory
                            }
                          });
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition duration-150 hover:border-l-4 border-gray-800 max-w-[200px]"
                      >
                        <img
                          src={prod.images?.[0]?.url}
                          alt={prod.name}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                        <span className="text-sm break-words min-w-[70%]">{prod.name.length > 20 ? prod.name.slice(0, 20) + '...' : prod.name}</span>
                      </button>
                    ))}
                  </NestedMenuItem>
                ))
              ) : (
                productsByCategory1[parent._id]?.map(prod => (
                  <button
                    key={prod._id}
                    onClick={() => {
                      const currentCategory = categories.find(c => c._id === parent._id);
                      const allProducts = productsByCategory1[parent._id] || [];

                      navigate(`/product/${prod._id}`, {
                        state: {
                          products: allProducts,
                          catData: productsByCategory[parent._id] || { items: allProducts },
                          cat: currentCategory
                        }
                      });
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 transition duration-150 hover:border-l-4 border-gray-800"
                  >
                    <img
                      src={prod.images?.[0]?.url}
                      alt={prod.name}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    <span className="text-sm break-words min-w-[70%]">{prod.name.length > 20 ? prod.name.slice(0, 20) + '...' : prod.name}</span>
                  </button>
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
        {label.length > 20 ? label.slice(0, 20) + '...' : label}
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
          className="absolute left-[-20%] top-4 mt-2 bg-white border rounded-lg shadow-xl min-w-[220px]"
          style={{ zIndex: 10001 }}
          onMouseEnter={() => {
            setActiveDropdown(id);
            // setActiveNested(null); // ⭐ VERY IMPORTANT
          }}
        >
          <div className="py-2 max-h-[500px] overflow-y-auto custom-scroll" role="menu">
            {children?.length > 0 ? children : <span className="flex justify-center items-center p-3">No item found</span>}
          </div>
        </div>
      )}
    </div>
  );
}