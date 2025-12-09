import api from "./axios";

export const fetchProducts = () => {
  return api.get(`/products`);
};
export const fetchFirst6Products = (categoryId) => {
  return api.get(`/products/navbar?category=${categoryId}&limit=6`);
};


export const fetchSingleProduct = (id) => {
  return api.get(`/products/${id}`);
};
