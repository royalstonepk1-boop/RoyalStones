import { create } from "zustand";
import { myOrdersApi ,allOrders } from "../api/order.api";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,

  fetchMyOrders: async () => {
    set({ loading: true });
    const res = await myOrdersApi();
    set({ orders: res.data, loading: false });
  },
  listOrders: async () => {
    set({ loading: true });
    const res = await allOrders();
    set({ orders: res.data, loading: false });
  },
}));
