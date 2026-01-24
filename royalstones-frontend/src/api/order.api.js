import api from "./axios";

export const allOrders = () => api.get("/orders");
export const createOrderApi = (payload) => api.post("/orders", payload);
export const myOrdersApi = () => api.get("/orders/my");
export const updateOrder = (orderID) => api.put("/orders/:id/status",orderID );
export const cancelOrder = (orderId) => api.put(`/orders/:id`,orderId );
export const createStripeSession = (payload) =>
  api.post("/payments/stripe-session", payload); // backend should return sessionId
