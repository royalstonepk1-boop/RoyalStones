import { create } from "zustand";
import {
  getCart,
  addToCartApi,
  removeFromCartApi,
} from "../api/cart.api";

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    const res = await getCart();
    set({ cart: res.data, loading: false });
  },

  addToCart: async (productId, quantity = 1) => {
    await addToCartApi(productId, quantity);
    const res = await getCart();
    set({ cart: res.data });
  },

  removeFromCart: async (productId) => {
    await removeFromCartApi(productId);
    const res = await getCart();
    set({ cart: res.data });
  },
}));
