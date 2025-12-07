import { create } from "zustand";
import { myOrdersApi } from "../api/order.api";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,

  fetchMyOrders: async () => {
    set({ loading: true });
    const res = await myOrdersApi();
    set({ orders: res.data, loading: false });
  },
}));
