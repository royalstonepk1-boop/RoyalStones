import api from "./axios";

// Get all users (to find admin)
export const getUsers = () => api.get("/users");
export const getAdmin = () => api.get("/users/getAdmin");

// Conversation APIs
export const createConversation = (data) => api.post("/conversations", data);
export const getConversations = () => api.get("/conversations");

// Message APIs
export const sendMessage = (data) => api.post("/messages", data);
export const updateMsgStatus = (id) => api.put(`/messages/markRead/${id}`);
export const getMessages = (conversationId) => api.get(`/messages/${conversationId}`);