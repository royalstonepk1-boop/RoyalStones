import api from "./axios";

export const getCart = () => api.get("/cart");

export const addToCartApi = (productId, quantity = 1 ,fingerSize) =>
  api.post("/cart/add", { productId, quantity, fingerSize});

export const removeFromCartApi = (productId) =>
  api.put("/cart/remove", { productId });

export const updateCartItemApi = (productId, quantity ,fingerSize) => 
  api.put(`/cart/update`, { productId, quantity,fingerSize });

