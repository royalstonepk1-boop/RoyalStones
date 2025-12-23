import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { useOrderStore } from "../../store/orderStore";
import PageWrapper from "../../util/PageWrapper";
import { useDeliveryStore } from "../../store/deliveryStore";
import {toast} from 'react-toastify';

// Mock API functions - replace with your actual API calls
const api = {
  get: async (url) => {
    // Replace with actual API call
    return { data: [] };
  },
  post: async (url, data) => {
    return { data };
  },
  put: async (url, data) => {
    return { data };
  },
  delete: async (url) => {
    return { data: { message: 'Deleted' } };
  }
};

// Dashboard Component
function Dashboard() {
  const {products,categories} = useProductStore();
  const {orders} = useOrderStore();

  const [stats, setStats] = useState({
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalCategories: categories.length
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl md:text-2xl font-bold  text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-0 mb-8">
          <StatCard title="Total Products" value={stats.totalProducts} color="blue" />
          <StatCard title="Total Orders" value={stats.totalOrders} color="green" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} color="yellow" />
          <StatCard title="Categories" value={stats.totalCategories} color="purple" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`${colors[color]} w-25 h-25 rounded-lg flex items-center justify-center mb-4`}>
        <span className="text-white text-2xl font-bold">{value}</span>
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    </div>
  );
}


// Products Management Component
function ManageProducts() {
  const {products ,categories,loading ,getProducts , getCategories} = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    images: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'images' && form[key]) {
          Array.from(form[key]).forEach(file => {
            formData.append('images', file);
          });
        } else if (form[key]) {
          formData.append(key, form[key]);
        }
      });

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }

      resetForm();
      getProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      categoryId: product.categoryId?._id || '',
      price: product.price,
      discountPrice: product.discountPrice || '',
      stockQuantity: product.stockQuantity,
      images: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      getProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      slug: '',
      description: '',
      categoryId: '',
      price: '',
      discountPrice: '',
      stockQuantity: '',
      images: null
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    const query = searchQuery?.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.slug.toLowerCase().includes(query) ||
      product.categoryId?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manage Products</h1>
          {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-3 pl-10 text-md border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="product-slug"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rs) *
                </label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price (Rs)
                </label>
                <input
                  type="number"
                  value={form.discountPrice}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  value={form.stockQuantity}
                  onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, images: e.target.files })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">You can select multiple images (max 8)</p>
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 cursor-pointer px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}



        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(searchQuery ? filteredProducts : products) ?.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.images?.[0]?.url && (
                        <img 
                          src={product.images[0].url} 
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.categoryId?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Rs {product.discountPrice || product.price}
                      {product.discountPrice && (
                        <span className="text-gray-400 line-through ml-2">Rs {product.price}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.stockQuantity > 10 ? 'bg-green-100 text-green-800' : 
                      product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stockQuantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 bg-gray-300 rounded-[10px] p-2 cursor-pointer hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 bg-gray-300 rounded-[10px] p-2 cursor-pointer hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No products found. Add your first product!
            </div>
          )}
        </div>
        { 
        (!products || products.length === 0) &&
        <div className="text-center pt-10">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
      }
      </div>
    </div>
  );
}

// Categories Management Component
function ManageCategories() {
  const {categories , loading , getCategories} = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [form, setForm] = useState({
    name: '',
    hasFingerSize: false,
    carretRateMin: '',
    carretRateMax: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        hasFingerSize: form.hasFingerSize,
        carretRateMin: parseFloat(form.carretRateMin) || 0,
        carretRateMax: parseFloat(form.carretRateMax) || 0
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, payload);
      } else {
        await api.post('/categories', payload);
      }

      resetForm();
      getCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      hasFingerSize: category.hasFingerSize || false,
      carretRateMin: category.carretRate?.min || 0,
      carretRateMax: category.carretRate?.max || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      getCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      hasFingerSize: false,
      carretRateMin: '',
      carretRateMax: ''
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  // Filter products based on search query
  const filteredCategories = categories.filter(cat => {
    const query = searchQuery?.toLowerCase();
    return (
      cat.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manage Categories</h1>
          <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-3 pl-10 text-md border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasFingerSize"
                  checked={form.hasFingerSize}
                  onChange={(e) => setForm({ ...form, hasFingerSize: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hasFingerSize" className="ml-2 text-sm font-medium text-gray-700">
                  Has Finger Size Option
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Caret Rate Min
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.carretRateMin}
                    onChange={(e) => setForm({ ...form, carretRateMin: e.target.value })}
                    className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Caret Rate Max
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.carretRateMax}
                    onChange={(e) => setForm({ ...form, carretRateMax: e.target.value })}
                    className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 cursor-pointer px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y divide-gray-200">
            {(searchQuery ? filteredCategories : categories).map(category => (
              <div key={category._id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  <div className="mt-1 flex gap-4 text-sm text-gray-500">
                    <span>Finger Size: {category.hasFingerSize ? 'Yes' : 'No'}</span>
                    {category.carretRate && (
                      <span>Caret Rate: {category.carretRate.min} - {category.carretRate.max}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 bg-gray-300 rounded-[10px] p-2 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 bg-gray-300 rounded-[10px] p-2 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No categories found. Add your first category!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Orders Management Component
function ManageOrders() {
  const {orders} = useOrderStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(null);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
    //   loadOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  let filteredOrders='';

  if(searchQuery){
  filteredOrders = orders.filter(ord => {
    return (
      ord.orderNumber.toString().includes(searchQuery)
    );
  });
  }
  else{
    filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  }
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Manage Orders</h1>
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number..."
              className="w-full px-4 py-3 pl-10 text-md border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 p-2 flex gap-2 overflow-x-auto">
          {['all', 'pending', 'paid', 'in_transit', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                filter === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white rounded-lg border-gray-500 border-1 shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                </span>
                {/* Status Update */}
              <div className="">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border outline-none cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{order.userId?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod?.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium text-lg">Rs {order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delivery Charges</p>
                  <p className="font-medium">Rs {order.deliveryCharges}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                <div className="space-y-2">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.productId?.name || 'Product'} × {item.quantity}</span>
                      <span className="font-medium">Rs {item.price * item.quantity * item.carretValue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="border-t pt-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Shipping Address:</p>
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p>Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>
              )}

              
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            No orders found in this category.
          </div>
        )}
      </div>
    </div>
  );
}

// Delivery Charges Management Component
function ManageDelivery() {
  const {chargesResp ,updateCharges,fetchChargesResp, loading} = useDeliveryStore();
  const [newCharges, setNewCharges] = useState(0);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        updateCharges(chargesResp?._id, parseInt(newCharges));
        fetchChargesResp();
        toast.success("Charges Updated Sucessfully!", {
                position: "top-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
        });
    } catch (error) {
        toast.error(error.message, {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Delivery Charges</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Current Delivery Charges</p>
                <p className="text-3xl font-bold text-blue-600">Rs {chargesResp?.charges}</p>
              </div>
              <div className="text-4xl">🚚</div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Delivery Charges (Rs) *
              </label>
              <input
                type="number"
                step="100"
                min={0}
                required
                value={newCharges}
                onChange={(e) => setNewCharges(e.target.value)}
                className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new delivery charges"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Delivery Charges'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> These charges will be applied to all new orders. Existing orders will not be affected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component with Routing
export default function AdminApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const {getProducts,getCategories} = useProductStore();
  const {listOrders} = useOrderStore();
  const {fetchChargesResp} = useDeliveryStore();

  const renderPage = () => {
    getProducts();
    getCategories();
    listOrders();
    fetchChargesResp();
    switch (currentPage) {
      case 'products':
        return <PageWrapper> <ManageProducts /> </PageWrapper>;
      case 'categories':
        return <PageWrapper> <ManageCategories /> </PageWrapper>;
      case 'orders':
        return <PageWrapper> <ManageOrders /> </PageWrapper>;
      case 'delivery':
        return <PageWrapper> <ManageDelivery /> </PageWrapper>;
      default:
        return <PageWrapper> <Dashboard /> </PageWrapper>;
    }
  };

  return (
  <PageWrapper>
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
            {/* <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Royal Stones Admin</h1>
            </div> */}
            <div className="flex space-x-4 justify-center items-center h-14">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('products')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${
                  currentPage === 'products'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setCurrentPage('categories')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${
                  currentPage === 'categories'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setCurrentPage('orders')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${
                  currentPage === 'orders'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setCurrentPage('delivery')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${
                  currentPage === 'delivery'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Delivery
              </button>
            </div>
        </div>
      </nav>

      {/* Page Content */}
      {renderPage()}
    </div>
    </PageWrapper>
  );
}