import api from "./axios";

export const getChargesApi = () => api.get("/delivery");
export const addChargesApi = (DeliveryCharges) => api.post("/delivery", { charges:DeliveryCharges });
export const updateChargesApi = (id, DeliveryCharges) => api.put("/delivery", { id, charges:DeliveryCharges });
