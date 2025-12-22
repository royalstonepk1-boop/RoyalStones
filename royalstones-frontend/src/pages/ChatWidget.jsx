import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Get user and token from auth store
  const { user, token } = useAuthStore();

  // Get message store functions and state
  const {
    messages,
    currentConversationId,
    loading,
    error,
    createConversation,
    fetchMessages,
    sendMessage: sendMessageToStore,
  } = useMessageStore();

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation when chat opens
  useEffect(() => {
    if (isOpen && user && token && !currentConversationId) {
      createConversation(user._id);
    }
  }, [isOpen, user, token, currentConversationId, createConversation]);

  // Poll for new messages every 3 seconds when chat is open
  useEffect(() => {
    if (isOpen && currentConversationId) {
      const interval = setInterval(() => {
        fetchMessages(currentConversationId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, currentConversationId, fetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversationId) return;

    const message = newMessage;
    setNewMessage('');
    await sendMessageToStore(currentConversationId, message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // If user is not logged in, show login prompt
  if (!user || !token) {
    return (
      <a 
        href="/login"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        title="Login to chat"
      >
        <i className="bi bi-chat-dots text-2xl md:text-3xl"></i>
      </a>
    );
  }

  return (
    <>
      {/* Chat Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-5 md:right-22 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          title="Chat with us"
        >
          <i className="bi bi-chat-dots text-2xl md:text-3xl"></i>
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-[100vw] md:w-[40vw] h-[70vh] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="bi bi-chat-dots text-xl"></i>
              <h3 className="font-semibold">Chat with Admin</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-600 rounded-[50%] py-1 px-2 transition-colors"
            >
              <i className="bi bi-x-lg text-md"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-3 text-sm">
                {error}
              </div>
            )}
            
            {messages.length === 0 && !loading ? (
              <div className="text-center text-gray-500 mt-35">
                <i className="bi bi-chat-left-text text-4xl mb-2"></i>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages
                .map((msg) => {
                  const isCurrentUser = msg.senderId._id === user._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          isCurrentUser
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.message}</p>
                        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading || !currentConversationId}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !newMessage.trim() || !currentConversationId}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <i className="bi bi-hourglass-split animate-spin"></i>
                ) : (
                  <i className="bi bi-send cursor-pointer"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}