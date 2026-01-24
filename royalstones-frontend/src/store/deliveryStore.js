import { create } from "zustand";
import { getChargesApi, addChargesApi,updateChargesApi } from "../api/charges.api";

export const useDeliveryStore = create((set) => ({
  charges: 0,
  chargesResp: {},
  loading: false,

  fetchCharges: async () => {
    set({ loading: true });
    const res = await getChargesApi();
    set({ charges: res.data[0].charges, loading: false });
  },

  fetchChargesResp: async () => {
    set({ loading: true });
    const res = await getChargesApi();
    set({ chargesResp: res.data[0], loading: false });
  },

  addCharges: async (DeliveryCharges) => {
    set({ loading: true });
    try {
      const res = await addChargesApi(DeliveryCharges);
      set({ charges: res.data[0].charges, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to add to cart:', error);
    }
  },

  updateCharges: async (id, DeliveryCharges) => {
    set({ loading: true });
    try {
      const res = await updateChargesApi(id, DeliveryCharges);
      set({ chargesResp: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to update quantity:', error);
    }
  },
}));
