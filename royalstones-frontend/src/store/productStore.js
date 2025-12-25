import { create } from "zustand";
import { fetchProducts, fetchFirst6Products, fetchSingleProduct ,createProduct ,updateProduct ,deleteProduct, } from "../api/product.api";
import { fetchCategories,updateSingleCategory, createCategory ,deleteCategory } from "../api/category.api";

export const useProductStore = create((set, get) => ({
  // global list (if you still need it)
  products: [],
  categories: [],
  // per-category store: { [categoryId]: { items: [], page: 0, finished: false, loading: false } }
  productsByCategory: {},
  product: null,
  loading: false,

  // keep existing getProducts for any global listing (optional usage)
  getProducts: async (search = "", category = "") => {
    set({ loading: true });
    try {
      const res = await fetchProducts({ search, category });
      set({ products: res.data || [], loading: false });
    } catch (err) {
      console.error("getProducts error", err);
      set({ loading: false });
    }
  },

  getCategories: async () => {
    set({ loading: true });
    try {
      const res = await fetchCategories();
      set({ categories: res.data || [], loading: false });
    } catch (err) {
      console.error("getCategories error", err);
      set({ loading: false });
    }
  },

  // load first page for a category (page 0) or subsequent pages
  getProductsByCategory: async (categoryId, { append = false, limit = 6 } = {}) => {
    if (!categoryId) return;
    const state = get();
    const catState = state.productsByCategory[categoryId] || { items: [], page: 0, finished: false, loading: false };

    if (catState.finished && append) return; // nothing more to load

    // determine next page
    const nextPage = append ? (catState.page + 1) : 0;

    // set loading for this category
    set((s) => ({
      productsByCategory: {
        ...s.productsByCategory,
        [categoryId]: { ...(s.productsByCategory[categoryId] || { items: [], page: 0, finished: false }), loading: true }
      }
    }));

    try {
      const res = await fetchFirst6Products(categoryId, nextPage, limit);
      const fetched = Array.isArray(res.data) ? res.data : [];

      set((s) => {
        const prev = s.productsByCategory[categoryId] || { items: [], page: 0, finished: false };
        const items = append ? prev.items.concat(fetched) : fetched;
        const finished = fetched.length < limit; // less than requested => no more
        return {
          productsByCategory: {
            ...s.productsByCategory,
            [categoryId]: { items, page: nextPage, finished, loading: false }
          }
        };
      });
    } catch (err) {
      console.error("getProductsByCategory error", err);
      // clear loading flag
      set((s) => ({
        productsByCategory: {
          ...s.productsByCategory,
          [categoryId]: { ...(s.productsByCategory[categoryId] || { items: [], page: 0 }), loading: false }
        }
      }));
    }
  },

  getProductById: async (id) => {
    set({ loading: true });
    try {
      const res = await fetchSingleProduct(id);
      set({ product: res.data, loading: false });
    } catch (err) {
      console.error("getProductById error", err);
      set({ loading: false });
    }
  },
  createProduct: async (data) => {
    set({ loading: true });
    try {
      const res = await createProduct(data);
      set({ products: [ res.data, ...products], loading: false });
    } catch (err) {
      console.error("getProductById error", err);
      set({ loading: false });
    }
  },
  updateProduct: async (id,data) => {
    set({ loading: true });
    try {
      const res = await updateProduct(id,data);
      set({ product:res.data, loading: false });
    } catch (err) {
      console.error("getProductById error", err);
      set({ loading: false });
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await deleteProduct(id);
      set({ product: null, loading: false });
    } catch (err) {
      console.error("getProductById error", err);
      set({ loading: false });
    }
  },
  deleteCategory: async (id) => {
    set({ loading: true });
    try {
      const res = await deleteCategory(id);
      console.log(res);
      set((state)=>({ categories: state.categories.filter((c)=> c._id !== id ), loading: false }));
    } catch (err) {
      console.error("getProductById error", err);
      set({ loading: false });
    }
  },
    updateCateoryByID: async (id,data) => {
      set({ loading: true });
      const res = await updateSingleCategory(id,data);
      set((state)=>({ categories: state.categories.filter((c)=> c._id === res.data._id ? res.data : c), loading: false }));
    },
    createCategory: async (data) => {
      set({ loading: true });
      const res = await createCategory(data);
      set((state) => ({ 
        categories: [res.data, ...state.categories], 
        loading: false 
      }));
    },
}));
