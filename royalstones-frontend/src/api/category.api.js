import api from "./axios";

export const fetchCategories = () => api.get("/categories");
export const fetchSingleCategory = (id) => api.get(`/categories/${id}`);
