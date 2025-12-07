import api from "./axios";

export const createOrderApi = (payload) => api.post("/orders", payload);
export const myOrdersApi = () => api.get("/orders/my");
export const createStripeSession = (payload) =>
  api.post("/payments/stripe-session", payload); // backend should return sessionId
