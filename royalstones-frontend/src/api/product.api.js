import api from "./axios";

// existing endpoints kept
export const fetchProducts = (params = {}) => {
  // optional query params: search, category, page, limit, skip
  return api.get(`/products`, { params });
};

export const fetchFirst6Products = (categoryId, page = 0, limit = 6) => {
  // uses navbar endpoint for fast latest products per category
  const skip = page * limit;
  return api.get(`/products/navbar`, { params: { category: categoryId, limit, skip } });
};

export const fetchSingleProduct = (id) => {
  return api.get(`/products/${id}`);
};
