import { create } from "zustand";
import { getCart, addToCartApi, removeFromCartApi, updateCartItemApi } from "../api/cart.api";
import { useAuthStore } from "./authStore";

// Helper functions for guest cart (localStorage)
const GUEST_CART_KEY = 'guest_cart';

const getGuestCartFromStorage = () => {
  try {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : { items: [], updatedAt: new Date().toISOString() };
  } catch (error) {
    console.error('Failed to get guest cart:', error);
    return { items: [], updatedAt: new Date().toISOString() };
  }
};

const saveGuestCartToStorage = (cart) => {
  try {
    cart.updatedAt = new Date().toISOString();
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save guest cart:', error);
  }
};

const clearGuestCartFromStorage = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};

// Helper to find cart item
const findCartItem = (items, productId, fingerSize, carretValue) => {
  return items.findIndex(item => 
    item.productId === productId &&
    item.fingerSize === fingerSize &&
    item.carretValue === carretValue
  );
};

// Helper to check if user is authenticated
const isUserAuthenticated = () => {
  const { user } = useAuthStore.getState();
  // console.log(user,token)
  return !!(user);
};

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  isOpen: false,

  // ✅ Toggle sidebar
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  // ✅ Fetch cart (auto-detects user type)
  fetchCart: async () => {
    if (!isUserAuthenticated()) {
      // Load guest cart from localStorage
      // console.log('res')
      const guestCart = getGuestCartFromStorage();
      set({ cart: guestCart, loading: false });
      return;
    }

    // Fetch authenticated cart
    set({ loading: true });
    try {
      const res = await getCart();
      // console.log('res', res)
      set({ cart: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch cart:', error);
    }
  },

  // ✅ Add to cart (auto-detects user type)
  addToCart: async (productId, quantity = 1, fingerSize = 1, carretValue = 1, msgNote = '') => {
    if (!isUserAuthenticated()) {
      // Handle guest cart
      const guestCart = getGuestCartFromStorage();
      const existingIndex = findCartItem(guestCart.items, productId, fingerSize, carretValue);

      if (existingIndex !== -1) {
        // Update existing item
        guestCart.items[existingIndex].quantity += quantity;
        if (msgNote) {
          guestCart.items[existingIndex].msgNote = msgNote;
        }
      } else {
        // Add new item
        guestCart.items.push({
          productId,
          quantity,
          fingerSize: fingerSize || 1,
          carretValue: carretValue || 1,
          msgNote: msgNote || ''
        });
      }

      saveGuestCartToStorage(guestCart);
      set({ cart: guestCart });
      return;
    }

    // Handle authenticated cart
    set({ loading: true });
    try {
      const res = await addToCartApi(productId, quantity, fingerSize, carretValue, msgNote);
      set({ cart: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to add to cart:', error);
    }
  },

  // ✅ Update quantity (auto-detects user type)
  updateQuantity: async (productId, quantity, fingerSize = 1, carretValue = 1) => {
    if (!isUserAuthenticated()) {
      // Handle guest cart
      const guestCart = getGuestCartFromStorage();
      const existingIndex = findCartItem(guestCart.items, productId, fingerSize, carretValue);

      if (existingIndex !== -1) {
        if (quantity <= 0) {
          guestCart.items.splice(existingIndex, 1);
        } else {
          guestCart.items[existingIndex].quantity = quantity;
        }
        saveGuestCartToStorage(guestCart);
        set({ cart: guestCart });
      }
      return;
    }

    // Handle authenticated cart
    set({ loading: true });
    try {
      const res = await updateCartItemApi(productId, quantity, fingerSize, carretValue);
      set({ cart: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to update quantity:', error);
    }
  },

  // ✅ Remove item (auto-detects user type)
  removeItem: async (productId, fingerSize = 1, carretValue = 1) => {
    if (!isUserAuthenticated()) {
      // Handle guest cart
      const guestCart = getGuestCartFromStorage();
      const existingIndex = findCartItem(guestCart.items, productId, fingerSize, carretValue);

      if (existingIndex !== -1) {
        guestCart.items.splice(existingIndex, 1);
        saveGuestCartToStorage(guestCart);
        set({ cart: guestCart });
      }
      return;
    }

    // Handle authenticated cart
    set({ loading: true });
    try {
      const res = await removeFromCartApi(productId, fingerSize, carretValue);
      set({ cart: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to remove item:', error);
    }
  },

  // ✅ Clear entire cart
  clearCart: () => {
    clearGuestCartFromStorage();
    set({ cart: { items: [], updatedAt: new Date().toISOString() } });
  },

  // ✅ Get cart item count
  getCartCount: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },
}));