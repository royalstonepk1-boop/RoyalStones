import api from "./axios";

export const adminCreateProduct = (formData) =>
  api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminUpdateProduct = (id, formData) =>
  api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminDeleteProduct = (id) =>
  api.delete(`/products/${id}`);
