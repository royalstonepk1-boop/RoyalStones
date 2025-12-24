import { create } from "zustand";
import { myOrdersApi ,allOrders ,updateOrder } from "../api/order.api";

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
  updateOrderStatus: async (orderID) => {
    set({ loading: true });
    const res = await updateOrder(orderID);
    set({ orders: orders.filter((o)=> o._id === res.data._id ? res.data : o), loading: false });
  },
}));
