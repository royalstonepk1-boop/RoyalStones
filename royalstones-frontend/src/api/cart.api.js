import api from "./axios";

export const getCart = () => api.get("/cart");

export const addToCartApi = (productId, quantity = 1) =>
  api.post("/cart/add", { productId, quantity });

export const removeFromCartApi = (productId) =>
  api.post("/cart/remove", { productId });
