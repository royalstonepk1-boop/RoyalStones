import api from "./axios";

export const getProfile = () => api.get("/users/me");
export const getUsers = () => api.get("/users/");
export const getUserByEmail = (email) =>
    api.get("/users/email", {
        params: { email },
    });

export const addProfileWithEmail = (data) => api.post("/users/registerWithEmail", data);
export const addProfileWithGoogle = (data) => api.post("/users/registerWithGoogle", data);

export const updateProfile = (data) => api.put("/users/me", data);
