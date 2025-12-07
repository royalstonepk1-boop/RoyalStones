import { create } from "zustand";
import { fetchProducts, fetchSingleProduct } from "../api/product.api";

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  loading: false,

  getProducts: async () => {
    set({ loading: true });
    const res = await fetchProducts();
    set({ products: res.data, loading: false });
  },

  getProductById: async (id) => {
    set({ loading: true });
    const res = await fetchSingleProduct(id);
    set({ product: res.data, loading: false });
  },
}));
