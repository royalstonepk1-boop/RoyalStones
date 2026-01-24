import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { fetchCategories } from "../api/category.api";
import ProductList from "../components/product/ProductList";
import PageWrapper from "../util/PageWrapper";
import { Sparkles, Star, Calendar, ArrowLeft } from "lucide-react";

// Zodiac signs with their associated gemstones and date ranges
const ZODIAC_SIGNS = [
    {
        id: "aquarius",
        name: "Aquarius (دلو)",
        nameEn: "Aquarius",
        nameUrdu: "دلو",
        dateRange: "Jan 20 - Feb 18",
        startMonth: 1,
        startDay: 20,
        endMonth: 2,
        endDay: 18,
        icon: "♒",
        gemstones: ["Amethyst", "Garnet", "Aquamarine", "Turquoise"],
        color: "from-blue-500 to-indigo-500"
    },
    {
        id: "pisces",
        name: "Pisces (حوت)",
        nameEn: "Pisces",
        nameUrdu: "حوت",
        dateRange: "Feb 19 - Mar 20",
        startMonth: 2,
        startDay: 19,
        endMonth: 3,
        endDay: 20,
        icon: "♓",
        gemstones: ["Aquamarine", "Amethyst", "Moonstone", "Bloodstone"],
        color: "from-teal-500 to-cyan-500"
    },
    {
        id: "aries",
        name: "Aries (حمل)",
        nameEn: "Aries",
        nameUrdu: "حمل",
        dateRange: "Mar 21 - Apr 19",
        startMonth: 3,
        startDay: 21,
        endMonth: 4,
        endDay: 19,
        icon: "♈",
        gemstones: ["Diamond", "Ruby", "Red Jasper", "Bloodstone"],
        color: "from-red-500 to-orange-500"
    },
    {
        id: "taurus",
        name: "Taurus (ثور)",
        nameEn: "Taurus",
        nameUrdu: "ثور",
        dateRange: "Apr 20 - May 20",
        startMonth: 4,
        startDay: 20,
        endMonth: 5,
        endDay: 20,
        icon: "♉",
        gemstones: ["Emerald", "Rose Quartz", "Jade", "Sapphire"],
        color: "from-green-500 to-emerald-500"
    },
    {
        id: "gemini",
        name: "Gemini (جوزا)",
        nameEn: "Gemini",
        nameUrdu: "جوزا",
        dateRange: "May 21 - Jun 20",
        startMonth: 5,
        startDay: 21,
        endMonth: 6,
        endDay: 20,
        icon: "♊",
        gemstones: ["Agate", "Citrine", "Tiger's Eye", "Pearl"],
        color: "from-yellow-500 to-amber-500"
    },
    {
        id: "cancer",
        name: "Cancer (سرطان)",
        nameEn: "Cancer",
        nameUrdu: "سرطان",
        dateRange: "Jun 21 - Jul 22",
        startMonth: 6,
        startDay: 21,
        endMonth: 7,
        endDay: 22,
        icon: "♋",
        gemstones: ["Moonstone", "Pearl", "Ruby", "Emerald"],
        color: "from-blue-400 to-cyan-400"
    },
    {
        id: "leo",
        name: "Leo (اسد)",
        nameEn: "Leo",
        nameUrdu: "اسد",
        dateRange: "Jul 23 - Aug 22",
        startMonth: 7,
        startDay: 23,
        endMonth: 8,
        endDay: 22,
        icon: "♌",
        gemstones: ["Peridot", "Ruby", "Onyx", "Diamond"],
        color: "from-orange-500 to-yellow-500"
    },
    {
        id: "virgo",
        name: "Virgo (سنبلہ)",
        nameEn: "Virgo",
        nameUrdu: "سنبلہ",
        dateRange: "Aug 23 - Sep 22",
        startMonth: 8,
        startDay: 23,
        endMonth: 9,
        endDay: 22,
        icon: "♍",
        gemstones: ["Sapphire", "Carnelian", "Jade", "Jasper"],
        color: "from-green-600 to-teal-600"
    },
    {
        id: "libra",
        name: "Libra (میزان)",
        nameEn: "Libra",
        nameUrdu: "میزان",
        dateRange: "Sep 23 - Oct 22",
        startMonth: 9,
        startDay: 23,
        endMonth: 10,
        endDay: 22,
        icon: "♎",
        gemstones: ["Opal", "Lapis Lazuli", "Peridot", "Sapphire"],
        color: "from-pink-500 to-rose-500"
    },
    {
        id: "scorpio",
        name: "Scorpio (عقرب)",
        nameEn: "Scorpio",
        nameUrdu: "عقرب",
        dateRange: "Oct 23 - Nov 21",
        startMonth: 10,
        startDay: 23,
        endMonth: 11,
        endDay: 21,
        icon: "♏",
        gemstones: ["Topaz", "Opal", "Ruby", "Garnet"],
        color: "from-red-600 to-purple-600"
    },
    {
        id: "sagittarius",
        name: "Sagittarius (قوس)",
        nameEn: "Sagittarius",
        nameUrdu: "قوس",
        dateRange: "Nov 22 - Dec 21",
        startMonth: 11,
        startDay: 22,
        endMonth: 12,
        endDay: 21,
        icon: "♐",
        gemstones: ["Turquoise", "Topaz", "Amethyst", "Ruby"],
        color: "from-purple-500 to-indigo-500"
    },
    {
        id: "capricorn",
        name: "Capricorn (جدی)",
        nameEn: "Capricorn",
        nameUrdu: "جدی",
        dateRange: "Dec 22 - Jan 19",
        startMonth: 12,
        startDay: 22,
        endMonth: 1,
        endDay: 19,
        icon: "♑",
        gemstones: ["Garnet", "Onyx", "Ruby", "Agate"],
        color: "from-gray-700 to-slate-700"
    }
];

// Function to get zodiac sign from date
const getZodiacFromDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();
  
  for (const zodiac of ZODIAC_SIGNS) {
    // Handle zodiac signs that span across year boundary (like Capricorn)
    if (zodiac.startMonth > zodiac.endMonth) {
      if (
        (month === zodiac.startMonth && day >= zodiac.startDay) ||
        (month === zodiac.endMonth && day <= zodiac.endDay) ||
        (month > zodiac.startMonth || month < zodiac.endMonth)
      ) {
        return zodiac.id;
      }
    } else {
      if (
        (month === zodiac.startMonth && day >= zodiac.startDay) ||
        (month === zodiac.endMonth && day <= zodiac.endDay) ||
        (month > zodiac.startMonth && month < zodiac.endMonth)
      ) {
        return zodiac.id;
      }
    }
  }
  
  return null;
};

export default function ZodiacShop() {
  const { productsByCategory, getProductsByCategory, loading, getProducts } = useProductStore();
  const [categories, setCategories] = useState([]);
  const [selectedZodiac, setSelectedZodiac] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [search, setSearch] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [showZodiacInfo, setShowZodiacInfo] = useState(false);
  const [showZodiacGrid, setShowZodiacGrid] = useState(true); // New state to control visibility
  const location = useLocation();
  const navigate = useNavigate();
  const hasScrolled = useRef(false);

  useEffect(() => {
    getProducts(search, "");
  }, [getProducts]);

  useEffect(() => {
    hasScrolled.current = false;
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash && !hasScrolled.current) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          hasScrolled.current = true;
          navigate(location.pathname, { replace: true });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname, navigate]);

  useEffect(() => {
    fetchCategories()
      .then((res) => {
        const cats = res.data || [];
        setCategories(cats);
        cats.forEach((c) => {
          getProductsByCategory(c._id, { append: false });
        });
      })
      .catch((err) => {
        console.error("Category error", err);
      });
  }, [getProductsByCategory]);

  // Update zodiac when birth date changes
  useEffect(() => {
    if (birthDate) {
      const zodiacId = getZodiacFromDate(birthDate);
      if (zodiacId) {
        setSelectedZodiac(zodiacId);
        setShowZodiacInfo(true);
        setShowZodiacGrid(false); // Hide grid when date is selected
      }
    }
  }, [birthDate]);

  const handleDateChange = (e) => {
    setBirthDate(e.target.value);
  };

  const handleZodiacClick = (zodiacId) => {
    setSelectedZodiac(zodiacId);
    setBirthDate(""); // Clear date when manually selecting zodiac
    setShowZodiacGrid(false); // Hide grid when zodiac is selected
    setShowZodiacInfo(true); // Show zodiac info
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToZodiacGrid = () => {
    setShowZodiacGrid(true); // Show grid again
    setSelectedZodiac(""); // Clear selection
    setBirthDate(""); // Clear birth date
    setShowZodiacInfo(false); // Hide zodiac info
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterByZodiac = (products) => {
    if (!selectedZodiac) return products;
    
    const zodiac = ZODIAC_SIGNS.find(z => z.id === selectedZodiac);
    if (!zodiac) return products;

    return products.filter(product => {
      const productName = product.name.toLowerCase();
      return zodiac.gemstones.some(gemstone => 
        productName.includes(gemstone.toLowerCase())
      );
    });
  };

  const sortProductsByPrice = (products) => {
    if (!priceSort) return products;

    const sorted = [...products].sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (priceSort === "low") {
        return priceA - priceB;
      } else if (priceSort === "high") {
        return priceB - priceA;
      }
      return 0;
    });

    return sorted;
  };

  const selectedZodiacData = ZODIAC_SIGNS.find(z => z.id === selectedZodiac);

  return (
    <PageWrapper>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Zodiac Gemstone Collection
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
          <p className="text-sm sm:text-lg md:text-xl text-gray-600">
            Find Your Lucky Gemstones Based on Your Star Sign | اپنے ستارے کے مطابق قیمتی پتھر
          </p>
        </div>

        {/* Show Date Picker and Zodiac Grid only when showZodiacGrid is true */}
        {showZodiacGrid && (
          <>
            {/* Date Picker Section */}
            <div className="mb-6 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-purple-100">
              <div className="max-w-md mx-auto">
                <label className="block text-center mb-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                      Enter Your Birth Date | اپنی تاریخ پیدائش درج کریں
                    </span>
                  </div>
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={handleDateChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 cursor-pointer text-sm sm:text-base md:text-lg border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center text-lg"
                />
              </div>
            </div>

            {/* Zodiac Filter Section */}
            <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-base sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  Or Select Your Zodiac Sign Manually
                </h2>
              </div>

              {/* Zodiac Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {ZODIAC_SIGNS.map((zodiac) => (
                  <button
                    key={zodiac.id}
                    onClick={() => handleZodiacClick(zodiac.id)}
                    className="p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all border-gray-200 hover:border-purple-300 bg-white hover:scale-105"
                  >
                    <div className="text-2xl sm:text-3xl mb-1">{zodiac.icon}</div>
                    <div className="text-sm sm:text-md font-semibold text-gray-700">
                      {zodiac.nameEn}
                    </div>
                    <div className="text-sm md:text-base text-gray-500">
                      {zodiac.nameUrdu}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">
                      {zodiac.dateRange}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Show Selected Zodiac Details and Products when a zodiac is selected */}
        {!showZodiacGrid && selectedZodiacData && (
          <>
            {/* Back Button and Selected Zodiac Info */}
            <div className="mb-8">
              <button
                onClick={handleBackToZodiacGrid}
                className="mb-4 flex items-center cursor-pointer gap-2 px-6 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              <div className={`p-6 rounded-2xl bg-gradient-to-r ${selectedZodiacData.color} text-white shadow-xl`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-6xl">{selectedZodiacData.icon}</div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-1">
                      {selectedZodiacData.nameEn} ({selectedZodiacData.nameUrdu})
                    </h2>
                    <p className="text-sm sm:text-base opacity-90">{selectedZodiacData.dateRange}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-base sm:text-md font-semibold mb-2">Your Lucky Gemstones:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedZodiacData.gemstones.map((gem) => (
                      <span key={gem} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm sm:text-base font-medium">
                        {gem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by Price
                </label>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Default</option>
                  <option value="low">Low to High</option>
                  <option value="high">High to Low</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {(!productsByCategory || Object.keys(productsByCategory).length === 0) && (
              <div className="text-center pt-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            )}

            {/* Products by Category */}
            {categories
              .filter((cat) => {
                const items = productsByCategory[cat._id]?.items || [];
                const filteredItems = filterByZodiac(items);
                return filteredItems.length > 0;
              })
              .sort((a, b) => {
                const aItems = filterByZodiac(productsByCategory[a._id]?.items || []);
                const bItems = filterByZodiac(productsByCategory[b._id]?.items || []);
                return bItems.length - aItems.length;
              })
              .map((cat) => {
                const catData = productsByCategory[cat._id] || { items: [], page: 0, finished: false, loading: false };
                const filteredProducts = filterByZodiac(catData.items);
                const sortedProducts = sortProductsByPrice(filteredProducts);

                return (
                  <section key={cat._id} className="mb-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                      <h2 id={cat._id} className="text-xl sm:text-2xl font-semibold text-gray-800 break-words">
                        {cat.name.length > 30 ? cat.name.slice(0, 30) + '...' : cat.name}
                        <span className="ml-2 text-sm text-gray-500">
                          ({sortedProducts.length} items)
                        </span>
                      </h2>
                    </div>

                    {catData?.loading && catData?.items.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                      </div>
                    ) : sortedProducts.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No products match your zodiac sign</p>
                      </div>
                    ) : (
                      <ProductList
                        products={sortedProducts}
                        catData={{ ...catData, items: sortedProducts }}
                        getProductsByCategory={getProductsByCategory}
                        cat={cat}
                      />
                    )}
                  </section>
                );
              })}

            {/* No Results Message */}
            {selectedZodiac && categories.every(cat => {
              const items = productsByCategory[cat._id]?.items || [];
              return filterByZodiac(items).length === 0;
            }) && (
              <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <div className="text-6xl mb-4">{selectedZodiacData?.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No gemstones found for {selectedZodiacData?.nameEn}
                </h3>
                <p className="text-gray-600 mb-4">
                  We're currently updating our collection. Check back soon!
                </p>
                <button
                  onClick={handleBackToZodiacGrid}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View All Zodiac Signs
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}