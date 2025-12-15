import { create } from "zustand";
import { getCart, addToCartApi, removeFromCartApi, updateCartItemApi } from "../api/cart.api";

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,
  isOpen: false,

  // ✅ Toggle sidebar
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  // ✅ Fetch cart
  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await getCart();
      set({ cart: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch cart:', error);
    }
  },

  // ✅ Add to cart - backend returns updated cart
  addToCart: async (productId, quantity = 1 ,fingerSize) => {
    set({ loading: true });
    try {
      const res = await addToCartApi(productId, quantity ,fingerSize);
      set({ cart: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to add to cart:', error);
    }
  },

  // ✅ Update quantity - single API call
  updateQuantity: async (productId, quantity ,fingerSize) => {
    set({ loading: true });
    try {
      const res = await updateCartItemApi(productId, quantity, fingerSize);
      set({ cart: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to update quantity:', error);
    }
  },

  // ✅ Remove entire item - single API call
  removeItem: async (productId) => {
    set({ loading: true });
    try {
      const res = await removeFromCartApi(productId);
      set({ cart: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to remove item:', error);
    }
  },
}));