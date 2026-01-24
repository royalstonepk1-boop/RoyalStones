import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, products }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.categoryId?.name.toLowerCase().includes(query)
    ).slice(0, 8); // Show max 8 results

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  const handleOnClose = () => {
    setFilteredProducts([]);
    setSearchQuery('');
    onClose();
  };


  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 z-[101] bg-white shadow-2xl">
        <div className="max-w-4xl mx-auto p-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-6 py-3">
            <i className="bi bi-search text-xl text-gray-500"></i>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for gemstones..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} className='cursor-pointer' />
              </button>
            )}
            <button
              onClick={handleOnClose}
              className="text-gray-500 fixed top-4 right-8 hover:text-gray-700 ml-2"
            >
              <i className="bi bi-x-lg text-xl cursor-pointer"></i>
            </button>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-4 bg-white rounded-lg shadow-lg min-h-screen max-h-[80vh] overflow-y-auto">
              {filteredProducts.length > 0 ? (
                <div className="divide-y">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div className="flex-1 w-[40%]">
                        <h3 className="font-semibold text-gray-900 break-words">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 break-words">
                          {product.categoryId?.name}
                        </p>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          Rs {product.discountPrice || product.price}
                          {product.discountPrice && (
                            <span className="text-gray-400 line-through ml-2">
                              Rs {product.price}
                            </span>
                          )}
                        </p>
                      </div>
                      <i className="bi bi-arrow-right text-gray-400"></i>
                    </div>
                  ))}
                </div>
              ) : <div className="p-8 text-center min-h-screen text-gray-500">
              <i className="bi bi-search text-4xl mb-3 block"></i>
              <p>No products found for "{searchQuery}"</p>
            </div>}
            </div>
          )
          }

          {/* Popular Searches (when no query) */}
          {!searchQuery && (
            <>
            <div className="mt-4 p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Ruby', 'Emerald', 'Sapphire', 'Diamond', 'Pearl'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-[-100px] p-4 min-h-screen flex flex-col justify-center items-center text-gray-500">
              <i className="bi bi-search text-4xl mb-3 block"></i>
              <p>Start typing to search for gemstones</p>
          </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}