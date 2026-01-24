import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { useOrderStore } from "../../store/orderStore";
import PageWrapper from "../../util/PageWrapper";
import { useDeliveryStore } from "../../store/deliveryStore";
import { toast } from 'react-toastify';
import { countByCategory } from "../../api/product.api";
import { useAuthStore } from '../../store/authStore'
import { Bold } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
  const { products, categories } = useProductStore();
  const { orders } = useOrderStore();

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


const uploadToCloudinary = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'products');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          url: response.secure_url,
          publicId: response.public_id
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};

// Products Management Component
function ManageProducts() {
  const { products, categories, loading, getProducts, getCategories, createProduct, updateProduct, deleteProduct } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [uploading, setUploading] = useState(false);
  const descriptionRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    vedioUrl: '',
    carretRateMin: '',
    carretRateMax: '',
    images: null,
    certificateImage: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedImages = [];
      let uploadedCertificate = null;

      /* ================= IMAGE UPLOAD ================= */
      if (form.images && form.images.length > 0) {
        const toastId = toast.info('Preparing to upload images...', { autoClose: false });

        for (let i = 0; i < form.images.length; i++) {
          const file = form.images[i];

          toast.update(toastId, {
            render: `Uploading image ${i + 1}/${form.images.length}...`,
          });

          const result = await uploadToCloudinary(file, (progress) => {
            toast.update(toastId, {
              render: `Uploading image ${i + 1}/${form.images.length}: ${progress}%`,
            });
          });

          uploadedImages.push({
            url: result.url,
            isPrimary: i === 0,
          });
        }

        toast.dismiss(toastId);
        toast.success(`${form.images.length} image(s) uploaded successfully!`, {
          autoClose: 2000,
        });
      }

      /* ================= CERTIFICATE UPLOAD ================= */
      if (form.certificateImage instanceof File) {
        const toastId = toast.info('Uploading certificate...', { autoClose: false });

        const certResult = await uploadToCloudinary(form.certificateImage, (progress) => {
          toast.update(toastId, {
            render: `Uploading certificate: ${progress}%`,
          });
        });

        uploadedCertificate = certResult.url;
        toast.dismiss(toastId);
        toast.success('Certificate uploaded successfully!', { autoClose: 2000 });
      }

      /* ================= BASE PAYLOAD ================= */
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        categoryId: form.categoryId,
        price: form.price,
        discountPrice: form.discountPrice,
        stockQuantity: form.stockQuantity,
        vedioUrl: form.vedioUrl,
        carretRate: {
          min: parseFloat(form.carretRateMin) || 1,
          max: parseFloat(form.carretRateMax) || 1,
        },
      };

      /* ================= CONDITIONAL FIELDS ================= */
      // ✅ Images sirf tab bhejo jab naye upload hon
      if (uploadedImages.length > 0) {
        payload.images = uploadedImages;
      }

      // ✅ Certificate sirf tab bhejo jab update hua ho
      if (uploadedCertificate) {
        payload.certificateImage = uploadedCertificate;
      }

      /* ================= API CALL ================= */
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
        toast.success('Product Updated Successfully!');
      } else {
        await createProduct({
          ...payload,
          images: uploadedImages,
          certificateImage: uploadedCertificate || '',
        });
        toast.success('Product Added Successfully!');
      }

      resetForm();
      await getProducts();

    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(`Failed to save product: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleBold = () => {
    const textarea = descriptionRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.description.substring(start, end);
    const before = form.description.substring(0, start);
    const after = form.description.substring(end);

    if (selectedText) {
      // Wrap selected text with **
      const newText = before + '**' + selectedText + '**' + after;
      setForm({ ...form, description: newText });

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(end + 4, end + 4);
      }, 0);
    } else {
      // Insert ** markers
      const newText = before + '****' + after;
      setForm({ ...form, description: newText });

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };


  const handleEdit = (product) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      categoryId: product.categoryId?._id || '',
      price: product.price,
      discountPrice: product.discountPrice || '',
      stockQuantity: product.stockQuantity,
      vedioUrl: product.vedioUrl || '',
      carretRateMin: product.carretRate?.min || '',
      carretRateMax: product.carretRate?.max || '',
      images: null,
      certificateImage: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    toast.warning(
      ({ closeToast }) => (
        <div>
          <p className="mb-3">Are you sure you want to delete this product?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                deleteProduct(id);
                getProducts();
                closeToast();
                toast.success("Product deleted!", {
                  position: "top-right",
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                });
              }}
              className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    )
  }

  const resetForm = () => {
    setForm({
      name: '',
      slug: '',
      description: '',
      categoryId: '',
      price: '',
      discountPrice: '',
      stockQuantity: '',
      vedioUrl: '',
      carretRateMin: '',
      carretRateMax: '',
      images: null,
      certificateImage: null
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

                {/* Bold Button */}
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={handleBold}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors"
                    title="Make text bold"
                  >
                    <Bold size={16} />
                    <span className="text-sm">Bold</span>
                  </button>
                  <span className="text-xs text-gray-500 self-center">
                    Select text and click Bold, or use **text**
                  </span>
                </div>

                <textarea
                  ref={descriptionRef}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product description. Use **text** for bold"
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
                  {categories
                    .map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name.length > 30 ? cat.name.slice(0, 30) + '...' : cat.name}</option>
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
                  min={1}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Price in Rs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price (Rs)
                </label>
                <input
                  type="number"
                  value={form.discountPrice}
                  min={0}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Price in Rs"
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
                  min={1}
                  onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL (optional)
                </label>
                <input
                  type="text"
                  value={form.vedioUrl}
                  onChange={(e) => setForm({ ...form, vedioUrl: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please add video url"
                />
              </div>

              {/* Carret Rate Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carat Rate Min *
                </label>
                <input
                  type="number"
                  required
                  value={form.carretRateMin}
                  min={0}
                  step="0.5"
                  onChange={(e) => setForm({ ...form, carretRateMin: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carat Rate Max *
                </label>
                <input
                  type="number"
                  required
                  value={form.carretRateMax}
                  min={0}
                  step="0.5"
                  onChange={(e) => setForm({ ...form, carretRateMax: e.target.value })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 10.4"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                <label className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-500">
                    {form.images?.length
                      ? `${form.images.length} image(s) selected`
                      : "Select product images"}
                  </span>

                  <span className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md">
                    Browse
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, images: e.target.files })}
                    className="hidden"
                  />
                </label>

                <p className="text-xs text-gray-500 mt-1">You can select multiple images (max 8)</p>
              </div>

              {/* Certificate Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate Image (optional)
                </label>
                <label className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-500">
                    {form.certificateImage
                      ? form.certificateImage.name.length > 20 ? form.certificateImage.name.slice(0, 20) + '...' : form.certificateImage.name
                      : "Select certificate image"}
                  </span>

                  <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-md">
                    Browse
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, certificateImage: e.target.files[0] })}
                    className="hidden"
                  />
                </label>

                <p className="text-xs text-gray-500 mt-1">Upload certificate of authenticity</p>
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className={`bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors ${(loading || uploading)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'hover:bg-blue-700 cursor-pointer'
                    }`}
                >
                  {(loading || uploading) ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {uploading ? 'Uploading...' : (editingProduct ? 'Updating...' : 'Creating...')}
                    </span>
                  ) : (
                    editingProduct ? 'Update Product' : 'Create Product'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={uploading}
                  className="bg-gray-200 text-gray-700 cursor-pointer px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-auto">
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
                  Certificate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carat Rate
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(searchQuery ? filteredProducts : products)?.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-normal max-w-md">
                    <div className="flex items-start gap-3">
                      {product.images?.[0]?.url && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover shrink-0"
                        />
                      )}

                      <div className="text-sm font-medium text-gray-900 break-words w-[100%] pr-4">
                        {product.name}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-normal max-w-md">
                    <div className="text-sm text-gray-900 break-words w-[100%] pr-4">{product.categoryId?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Rs {product.discountPrice || product.price}
                      {product.discountPrice && (
                        <span className="text-gray-400 line-through ml-2">Rs {product.price}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-md">
                    <div className="text-sm text-gray-900">
                      {
                        product.certificateImage ?
                          <img
                            src={product.certificateImage}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover shrink-0"
                          /> : 'N/A'
                      }

                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${product.stockQuantity > 10 ? 'bg-green-100 text-green-800' :
                      product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {product.stockQuantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.carretRate ? (
                        <span>{product.carretRate.min} - {product.carretRate.max}</span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
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

function ManageCategories() {
  const { categories, getCategories, loading, createCategory, updateCateoryByID, deleteCategory } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [form, setForm] = useState({
    name: '',
    parentId: null,
    hasFingerSize: false,
  });

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        parentId: form.parentId || null,
        hasFingerSize: form.hasFingerSize,
      };

      if (editingCategory) {
        //console.log(payload);
        const resp = await updateCateoryByID(editingCategory._id, payload);
        toast.success("Category Updated!");

      } else {
        const resp = await createCategory(payload);
        toast.success("Category Added!");

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
      parentId: category.parentId || null,
      hasFingerSize: category.hasFingerSize || false,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const category = categories.find(c => c._id === id);
    const hasSubcategories = categories.some(c => c.parentId === id);

    if (hasSubcategories) {
      toast.error('Cannot delete category with subcategories. Delete subcategories first.');
      return;
    }

    // Check if category has products
    try {
      const productsCheck = await countByCategory(id);
      if (productsCheck.data.count > 0) {
        toast.error(`Cannot delete "${category.name}". It has ${productsCheck.data.count} products associated with it. Please reassign or delete the products first.`);
        return;
      }
    } catch (error) {
      console.error('Error checking products:', error);
      return;
    }

    toast.warning(
      ({ closeToast }) => (
        <div>
          <p className="mb-3">{`Are you sure you want to delete "${category.name}"?`}</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                deleteCategory(id);
                getCategories();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                closeToast();
                toast.success("Category deleted!", {
                  position: "top-right",
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                });
              }}
              className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    )
  };

  const resetForm = () => {
    setForm({
      name: '',
      parentId: null,
      hasFingerSize: false,
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Get parent categories (those with parentId === null)
  const parentCategories = categories.filter(cat => !cat.parentId);

  // Get subcategories for a given parent
  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parentId === parentId);
  };

  // Filter categories based on search
  const filterCategories = (cats) => {
    if (!searchQuery) return cats;
    const query = searchQuery.toLowerCase();
    return cats.filter(cat => cat.name.toLowerCase().includes(query));
  };

  const filteredParentCategories = filterCategories(parentCategories);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manage Categories</h1>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              {showForm ? 'Cancel' : '+ Add Category'}
            </button>
          </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category (Optional - leave empty for main category)
                </label>
                <select
                  value={form.parentId || ''}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
                  className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">None (Main Category)</option>
                  {parentCategories
                    .filter(cat => cat._id !== editingCategory?._id)
                    .map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name.length > 30 ? cat.name.substring(0, 27) + '...' : cat.name}
                      </option>
                    ))}
                </select>
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

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div> */}

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
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : filteredParentCategories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? 'No categories found matching your search.' : 'No categories found. Add your first category!'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredParentCategories.map(category => {
                const subcategories = getSubcategories(category._id);
                const filteredSubcategories = filterCategories(subcategories);
                const isExpanded = expandedCategories.has(category._id);
                const hasSubcategories = subcategories.length > 0;

                return (
                  <div key={category._id}>
                    {/* Parent Category */}
                    <div className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2 flex-1">
                          {hasSubcategories && (
                            <button
                              onClick={() => toggleCategory(category._id)}
                              className="mt-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                              <svg
                                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}
                          <div className={`${hasSubcategories ? '' : 'ml-7'} w-30 sm:w-60`}>
                            <h3 className="text-lg font-semibold text-gray-900 break-words">{category.name}</h3>
                            <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Main Category</span>
                              <span>Finger Size: {category.hasFingerSize ? 'Yes' : 'No'}</span>
                              {/* {category.carretRate && (category.carretRate.min > 0 || category.carretRate.max > 0) && (
                                <span>Caret Rate: {category.carretRate.min} - {category.carretRate.max}</span>
                              )} */}
                              {hasSubcategories && (
                                <span className="text-blue-600 font-medium">{subcategories.length} subcategories</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-1.5 cursor-pointer transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="text-red-600 hover:bg-red-50 rounded-lg px-3 py-1.5 cursor-pointer transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Subcategories */}
                    {isExpanded && hasSubcategories && (
                      <div className="bg-gray-50 border-t border-gray-200">
                        {filteredSubcategories.map(subcat => (
                          <div key={subcat._id} className="p-4 pl-16 hover:bg-gray-100 border-b border-gray-200 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div className='w-30 sm:w-60'>
                                <h4 className="text-base font-medium text-gray-800 break-words">
                                  <span className="text-gray-400 mr-2 ">↳</span>
                                  {subcat.name}
                                </h4>
                                <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Subcategory</span>
                                  <span>Finger Size: {subcat.hasFingerSize ? 'Yes' : 'No'}</span>
                                  {/* {subcat.carretRate && (subcat.carretRate.min > 0 || subcat.carretRate.max > 0) && (
                                    <span>Caret Rate: {subcat.carretRate.min} - {subcat.carretRate.max}</span>
                                  )} */}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(subcat)}
                                  className="text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-1.5 cursor-pointer transition-colors text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(subcat._id)}
                                  className="text-red-600 hover:bg-red-50 rounded-lg px-3 py-1.5 cursor-pointer transition-colors text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Orders Management Component
function ManageOrders() {
  const { orders, updateOrderStatus, listOrders } = useOrderStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(null);

  useEffect(() => {
    listOrders();
  }, [orders])


  const updateStatus = (orderID, status) => {
    try {
      updateOrderStatus({ orderID, status });
      toast.success('Order updated successfully');

    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error('Failed to update order');
    }
  };

  let filteredOrders = '';

  if (searchQuery) {
    filteredOrders = orders.filter(ord => {
      return (
        ord.orderNumber.toString().includes(searchQuery)
      );
    });
  }
  else {
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
              className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-colors ${filter === status
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
          {filteredOrders
            .reverse()
            .map(order => (
              <div key={order._id} className="bg-white rounded-lg border-gray-500 border-1 shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #RSSJ{order.orderNumber}
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
                      onChange={(e) => updateStatus(order._id, e.target.value)}
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
                        <span className='break-words w-[40%]'>{item.productId?.name || 'Product'} × {item.quantity} ({item.carretValue ? item.carretValue + ' Carat' : ''})</span>
                        {
                          item.msgNote !== '' &&
                          <span className="text-gray-600 max-w-200px break-words w-[40%] md:max-w-300px text-wrap">
                            ({item.msgNote})
                          </span>
                        }
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
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}

// Delivery Charges Management Component
function ManageDelivery() {
  const { chargesResp, updateCharges, fetchChargesResp, loading } = useDeliveryStore();
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
function ManageUsers() {
  const { allUsers, getAllUsers } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // all, admin, user

  useEffect(() => {
    getAllUsers();
  }, []);



  // Filter users based on search and role
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = searchQuery
      ? user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesRole = filterRole === 'all' ? true : user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Users Management
          </h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 cursor-pointer rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="bg-white px-4 py-2 rounded-lg shadow">
              Total Users: <strong>{allUsers?.length}</strong>
            </span>
            <span className="bg-white px-4 py-2 rounded-lg shadow">
              Admins: <strong>{allUsers?.filter(u => u.role === 'admin').length}</strong>
            </span>
            <span className="bg-white px-4 py-2 rounded-lg shadow">
              Regular Users: <strong>{allUsers?.filter(u => u.role === 'user').length}</strong>
            </span>
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            {searchQuery || filterRole !== 'all'
              ? 'No users found matching your filters.'
              : 'No users found.'}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'No name'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                          ? 'bg-purple-300 text-purple-800'
                          : 'bg-green-100 text-green-800'
                          }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {user.name || 'No name'}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {user.role || 'user'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>ID: {user._id.slice(-8)}</span>
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Main App Component with Routing
export default function AdminApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { getProducts, getCategories } = useProductStore();
  const { listOrders } = useOrderStore();
  const { fetchChargesResp } = useDeliveryStore();

  const renderPage = () => {
    getProducts();
    getCategories();
    listOrders();
    fetchChargesResp();
    switch (currentPage) {
      case 'products':
        return <ManageProducts />;
      case 'categories':
        return <ManageCategories />;
      case 'orders':
        return <ManageOrders />;
      case 'delivery':
        return <ManageDelivery />;
      case 'users':
        return <ManageUsers />;
      default:
        return <Dashboard />;
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
            <div className="flex space-x-0 md:space-x-4 justify-center items-center flex-wrap h-20 sm:h-14">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${currentPage === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('products')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${currentPage === 'products'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                Products
              </button>
              <button
                onClick={() => setCurrentPage('categories')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${currentPage === 'categories'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                Categories
              </button>
              <button
                onClick={() => setCurrentPage('orders')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${currentPage === 'orders'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                Orders
              </button>
              <button
                onClick={() => setCurrentPage('delivery')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${currentPage === 'delivery'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setCurrentPage('users')}
                className={`px-3 py-2 cursor-pointer rounded-md text-sm font-medium ${currentPage === 'users'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                Users
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