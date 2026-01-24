import api from "./axios";

export const adminCreateCategory = (name) =>
  api.post("/categories", { name });

export const adminDeleteCategory = (id) =>
  api.delete(`/categories/${id}`);
