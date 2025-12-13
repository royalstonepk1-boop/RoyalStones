import api from "./axios";

export const getProfile = () => api.get("/users/me");
export const getUserByEmail = (email) =>
    api.get("/users/email", {
        params: { email },
    });

export const addProfileWithEmail = (data) => api.post("/users/registerWithEmail", data);
export const addProfileWithGoogle = (data) => api.post("/users/registerWithGoogle", data);
