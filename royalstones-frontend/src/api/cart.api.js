import api from "./axios";

export const getCart = () => api.get("/cart");

export const addToCartApi = (productId, quantity = 1 ,fingerSize, carretValue ,msgNote) =>
  api.post("/cart/add", { productId, quantity, fingerSize ,carretValue, msgNote});

export const removeFromCartApi = (productId ,fingerSize, carretValue) =>
  api.put("/cart/remove", { productId ,fingerSize, carretValue });

export const updateCartItemApi = (productId, quantity ,fingerSize ,carretValue) => 
  api.put(`/cart/update`, { productId, quantity,fingerSize ,carretValue});

