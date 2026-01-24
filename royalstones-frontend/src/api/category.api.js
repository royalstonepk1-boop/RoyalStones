import api from "./axios";

export const fetchCategories = () => api.get("/categories");
export const fetchSingleCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post(`/categories` ,data);
export const updateSingleCategory = (id,data) => api.put(`/categories/${id}`,data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
