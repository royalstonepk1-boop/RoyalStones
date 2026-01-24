import { create } from "zustand";
import { 
  fetchProducts, 
  fetchFirst6Products, 
  fetchSingleProduct,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct
} from "../api/product.api";
import { 
  fetchCategories,
  updateSingleCategory, 
  createCategory as apiCreateCategory,
  deleteCategory as apiDeleteCategory
} from "../api/category.api";

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  productsByCategory: {},
  product: null,
  loading: false,

  getProducts: async (search = "", category = "") => {
    set({ loading: true });
    try {
      const res = await fetchProducts({ search, category });
      set({ products: res.data || [], loading: false });
      return res.data;
    } catch (err) {
      console.error("getProducts error:", err);
      set({ loading: false });
      throw err;
    }
  },

  getCategories: async () => {
    set({ loading: true });
    try {
      const res = await fetchCategories();
      set({ categories: res.data || [], loading: false });
      return res.data;
    } catch (err) {
      console.error("getCategories error:", err);
      set({ loading: false });
      throw err;
    }
  },

  getProductsByCategory: async (categoryId, { append = false, limit = 6 } = {}) => {
    if (!categoryId) return;
    const state = get();
    const catState = state.productsByCategory[categoryId] || { 
      items: [], 
      page: 0, 
      finished: false, 
      loading: false 
    };

    if (catState.finished && append) return;

    const nextPage = append ? (catState.page + 1) : 0;

    set((s) => ({
      productsByCategory: {
        ...s.productsByCategory,
        [categoryId]: { 
          ...(s.productsByCategory[categoryId] || { items: [], page: 0, finished: false }), 
          loading: true 
        }
      }
    }));

    try {
      const res = await fetchFirst6Products(categoryId, nextPage, limit);
      const fetched = Array.isArray(res.data) ? res.data : [];

      set((s) => {
        const prev = s.productsByCategory[categoryId] || { items: [], page: 0, finished: false };
        const items = append ? prev.items.concat(fetched) : fetched;
        const finished = fetched.length < limit;
        return {
          productsByCategory: {
            ...s.productsByCategory,
            [categoryId]: { items, page: nextPage, finished, loading: false }
          }
        };
      });
      return fetched;
    } catch (err) {
      console.error("getProductsByCategory error:", err);
      set((s) => ({
        productsByCategory: {
          ...s.productsByCategory,
          [categoryId]: { 
            ...(s.productsByCategory[categoryId] || { items: [], page: 0 }), 
            loading: false 
          }
        }
      }));
      throw err;
    }
  },

  getProductById: async (id) => {
    set({ loading: true });
    try {
      const res = await fetchSingleProduct(id);
      set({ product: res.data, loading: false });
      return res.data;
    } catch (err) {
      console.error("getProductById error:", err);
      set({ loading: false });
      throw err;
    }
  },

  createProduct: async (data) => {
    set({ loading: true });
    try {
      const res = await apiCreateProduct(data);
      set((state) => ({ 
        products: [res.data, ...state.products], 
        loading: false 
      }));
      return res.data;
    } catch (err) {
      console.error("createProduct error:", err);
      set({ loading: false });
      throw err;
    }
  },

  updateProduct: async (id, data) => {
    set({ loading: true });
    try {
      const res = await apiUpdateProduct(id, data);
      set((state) => ({
        products: state.products.map(p => p._id === id ? res.data : p),
        product: res.data,
        loading: false
      }));
      return res.data;
    } catch (err) {
      console.error("updateProduct error:", err);
      set({ loading: false });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await apiDeleteProduct(id);
      set((state) => ({
        products: state.products.filter(p => p._id !== id),
        product: null,
        loading: false
      }));
    } catch (err) {
      console.error("deleteProduct error:", err);
      set({ loading: false });
      throw err;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true });
    try {
      await apiDeleteCategory(id);
      set((state) => ({ 
        categories: state.categories.filter((c) => c._id !== id), 
        loading: false 
      }));
    } catch (err) {
      console.error("deleteCategory error:", err);
      set({ loading: false });
      throw err;
    }
  },

  updateCateoryByID: async (id, data) => {
    set({ loading: true });
    try {
      const res = await updateSingleCategory(id, data);
      set((state) => ({ 
        categories: state.categories.map(c => c._id === id ? res.data : c), 
        loading: false 
      }));
      return res.data;
    } catch (err) {
      console.error("updateCateoryByID error:", err);
      set({ loading: false });
      throw err;
    }
  },

  createCategory: async (data) => {
    set({ loading: true });
    try {
      const res = await apiCreateCategory(data);
      set((state) => ({ 
        categories: [res.data, ...state.categories], 
        loading: false 
      }));
      return res.data;
    } catch (err) {
      console.error("createCategory error:", err);
      set({ loading: false });
      throw err;
    }
  },
}));