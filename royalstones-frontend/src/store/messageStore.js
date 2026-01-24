import { create } from "zustand";
import { 
  getUsers, 
  createConversation as createConversationAPI, 
  getConversations, 
  sendMessage as sendMessageAPI, 
  getMessages as getMessagesAPI ,
  updateMsgStatus,
  getAdmin
} from "../api/message.api";

export const useMessageStore = create((set, get) => ({
  messages: [],
  conversations: [],
  currentConversationId: null,
  adminId: null,
  loading: false,
  error: null,

  // Fetch admin user ID
  fetchAdminId: async () => {
    try {
      const response = await getAdmin();
      const users = response.data;
      //console.log("Fetched users:", users[0]._id);
      
      
      if (users) {
        set({ adminId: users[0]._id });
        return users[0]._id;
      } else {
        set({ error: "No admin found" });
        return null;
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
      set({ error: error.message });
      return null;
    }
  },

  // Create or get existing conversation
  createConversation: async (userId) => {
    try {
      set({ loading: true, error: null });
      //console.log( get().adminId);
      let adminId = get().adminId;
      
      if (!adminId) {
        adminId = await get().fetchAdminId();
      }

      if (!adminId) {
        throw new Error("Admin not found");
      }

      const response = await createConversationAPI({ userId, adminId });
      const conversation = response.data;
      
      set({ 
        currentConversationId: conversation._id,
        loading: false 
      });
      
      // Fetch messages for this conversation
      await get().fetchMessages(conversation._id);
      
      return conversation._id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      set({ error: error.message, loading: false });
      return null;
    }
  },

  // Fetch messages for a conversation
  fetchMessages: async (conversationId) => {
    try {
      const response = await getMessagesAPI(conversationId);
      const messages = response.data;
      set({ messages, error: null });
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ error: error.message });
      return [];
    }
  },

  // Send a message
  sendMessage: async (conversationId, message) => {
    try {
      set({ loading: true, error: null });

      const response = await sendMessageAPI({ conversationId, message });
      const newMessage = response.data;
      
      // Add new message to existing messages
      set((state) => ({
        messages: [...state.messages, newMessage],
        loading: false,
      }));

      return newMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      set({ error: error.message, loading: false });
      return null;
    }
  },

  // Get all conversations for current user
  fetchConversations: async () => {
    try {
      const response = await getConversations();
      const conversations = response.data;
      set({ conversations, error: null });
      return conversations;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      set({ error: error.message });
      return [];
    }
  },

  updateMessageStatus: async (id) => {
    try {
      //console.log("Marking message status for conversation:", id);
      const response = await updateMsgStatus(id);
      //console.log("Message status updated:", response);
      
      set({ error: null });
      return response.data;
    } catch (error) {
      console.error("Error updating message status:", error);
      set({ error: error.message });
      return null;
    }
  },

  // Clear messages
  clearMessages: () => set({ messages: [], currentConversationId: null }),

  // Reset store
  reset: () => set({
    messages: [],
    conversations: [],
    currentConversationId: null,
    adminId: null,
    loading: false,
    error: null,
  }),
}));