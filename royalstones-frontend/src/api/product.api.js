import api from "./axios";

export const fetchProducts = () => {
  return api.get(`/products`);
};

export const fetchSingleProduct = (id) => {
  return api.get(`/products/${id}`);
};
