import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';
import { useLocation } from 'react-router-dom';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [userConversations, setUserConversations] = useState([]);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const { user, token } = useAuthStore();
  const {
    messages,
    currentConversationId,
    loading,
    error,
    createConversation,
    fetchMessages,
    fetchConversations,
    updateMessageStatus,
    sendMessage: sendMessageToStore,
  } = useMessageStore();

  const isAdmin = user?.role === 'admin';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId) => {
    try {
      //console.log('Marking messages as read for conversation:', conversationId);
      await updateMessageStatus(conversationId);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  // Fetch all user conversations for admin
  useEffect(() => {
    if (isOpen && isAdmin && token) {
      fetchAllUserConversations();
    }
  }, [isOpen, isAdmin, token]);

  const fetchAllUserConversations = async () => {
    try {
      const response = await fetchConversations();
      if (response) {
        setUserConversations(response);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [isOpen]);

  // Initialize conversation for regular users
  useEffect(() => {
    if (isOpen && user && token && !isAdmin && !currentConversationId) {
      createConversation(user._id);
    }
  }, [isOpen, user, token, isAdmin, currentConversationId, createConversation]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    const conversationId = isAdmin ? selectedConversationId : currentConversationId;
    if (isOpen && conversationId) {
      markMessagesAsRead(conversationId);
    }
  }, [isOpen, selectedConversationId, currentConversationId, isAdmin]);

  // Poll for messages
  useEffect(() => {
    if (isOpen && (currentConversationId || selectedConversationId)) {
      const conversationId = isAdmin ? selectedConversationId : currentConversationId;
      if (!conversationId) return;

      const interval = setInterval(() => {
        fetchMessages(conversationId);
        if (isAdmin) {
          fetchAllUserConversations();
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, currentConversationId, selectedConversationId, fetchMessages, isAdmin]);

  const handleUserSelect = async (conversation) => {
    const otherUser = conversation.users.find(u => u._id !== user._id);
    setSelectedUser(otherUser);
    setSelectedConversationId(conversation._id);
    await fetchMessages(conversation._id);
    await markMessagesAsRead(conversation._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const conversationId = isAdmin ? selectedConversationId : currentConversationId;
    
    if (!newMessage.trim() || !conversationId) return;

    const message = newMessage;
    setNewMessage('');
    await sendMessageToStore(conversationId, message);
    scrollToBottom();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1);
  };

  const getUserFromConversation = (conversation) => {
    return conversation.users.find(u => u.role !== 'admin') || conversation.users[0];
  };

  // Calculate total unread count from messages
  const getTotalUnreadCount = () => {
    return userConversations.reduce((total, conv) => {
      // Count unread messages from the conversation
      const unreadCount = conv.unreadMessages?.length || 0;
      return total + unreadCount;
    }, 0);
  };

  if (!user || !token) {
    return (
      <a 
        href="/login"
        className={`${(location.pathname === '/login' && 'hidden')} ${(location.pathname === '/register' && 'hidden')} fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50`}
        title="Login to chat"
      >
        <i className="bi bi-chat-dots text-2xl md:text-3xl"></i>
      </a>
    );
  }

  // Admin View
  if (isAdmin) {
    const totalUnread = getTotalUnreadCount();
    
    return (
      <>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 right-4 cursor-pointer md:bottom-6 md:right-6 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50"
            title="Admin Chat"
          >
            <i className="bi bi-chat-dots text-2xl md:text-3xl"></i>
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </button>
        )}

        {isOpen && (
          <div className="fixed bottom-20 right-0 md:bottom-6 md:right-6 w-[90vw] md:w-[50vw]  h-[70vh] bg-white rounded-lg shadow-2xl z-50 flex">
            {/* User List Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="bg-blue-500 text-white p-3 md:p-4 rounded-tl-lg md:rounded-tr-none flex items-center justify-between">
                <h3 className="font-semibold text-sm md:text-base">User Chats</h3>
                {totalUnread > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    {totalUnread}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                {userConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No conversations yet</p>
                  </div>
                ) : (
                  userConversations.map((conversation) => {
                    const conversationUser = getUserFromConversation(conversation);
                    const unreadCount = conversation.unreadMessages?.length || 0;
                    
                    return (
                      <div
                        key={conversation._id}
                        onClick={() => handleUserSelect(conversation)}
                        className={`p-2 md:p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                          selectedConversationId === conversation._id ? 'bg-blue-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="relative">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs md:text-sm">
                              {getInitials(conversationUser?.name)}
                            </div>
                            {unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white flex items-center justify-center font-semibold">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-xs md:text-sm truncate ${unreadCount > 0 ? 'font-bold' : ''}`}>
                              {conversationUser?.name || 'Unknown User'}
                            </p>
                            <p className={`text-[10px] md:text-xs text-gray-500 truncate ${unreadCount > 0 ? 'font-semibold text-gray-700' : ''}`}>
                              {conversation.lastMessage?.message?.length > 20 
                                ? conversation.lastMessage?.message?.slice(0, 20) + '...' 
                                : conversation.lastMessage?.message || 'No messages'}
                              <span className='float-right text-[9px] md:text-xs'>
                                {new Date(conversation.lastMessage?.createdAt ?? conversation.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col max-w-[50vw] md:max-w-[35vw]">
              <div className="bg-blue-500 text-white p-3 md:p-4 rounded-tr-lg md:rounded-tl-none flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedUser ? (
                    <>
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white text-blue-500 flex items-center justify-center font-semibold text-xs md:text-sm">
                        {getInitials(selectedUser.name)}
                      </div>
                      <h3 className="font-semibold text-sm md:text-base truncate">{selectedUser.name}</h3>
                    </>
                  ) : (
                    <h3 className="font-semibold text-sm md:text-base">Select a user to chat</h3>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-blue-600 rounded-full p-1 md:py-1 md:px-2 transition-colors"
                >
                  <i className="bi bi-x-lg text-sm md:text-base"></i>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 md:p-4 bg-gray-50">
                {error && (
                  <div className="bg-red-100 text-red-700 p-2 md:p-3 rounded-lg mb-2 md:mb-3 text-xs md:text-sm">
                    {error}
                  </div>
                )}
                
                {!selectedUser ? (
                  <div className="text-center text-gray-500 mt-10 md:mt-20">
                    <i className="bi bi-chat-left-text text-3xl md:text-4xl mb-2"></i>
                    <p className="text-xs md:text-sm">Select a user to view messages</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10 md:mt-20">
                    <i className="bi bi-chat-left-text text-3xl md:text-4xl mb-2"></i>
                    <p className="text-xs md:text-sm">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    {messages.map((msg) => {
                      const isAdminMessage = msg.senderId.role === 'admin' || msg.senderId._id === user._id;
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isAdminMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] md:max-w-[75%] rounded-lg p-2 md:p-3 ${
                              isAdminMessage
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                          >
                            <p className="text-xs md:text-sm break-words">{msg.message}</p>
                            <p className={`text-[10px] md:text-xs mt-1 ${isAdminMessage ? 'text-blue-100' : 'text-gray-500'}`}>
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

              <div className="p-2 md:p-4 border-t border-gray-200 bg-white rounded-br-lg">
                <div className="flex gap-1 md:gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedUser ? "Type message..." : "Select user..."}
                    className="flex-1 border border-gray-300 rounded-lg px-2 max-w-[150px] sm:max-w-[100%] md:px-4 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading || !selectedConversationId || !selectedUser}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !newMessage.trim() || !selectedConversationId || !selectedUser}
                    className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-3 md:px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <i className="bi bi-hourglass-split animate-spin text-sm"></i>
                    ) : (
                      <i className="bi bi-send text-sm"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Regular User View
  return (
    <>
      {!isOpen && (location.pathname !== '/login' && location.pathname !== '/register') && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 cursor-pointer md:bottom-6 md:right-6 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          title="Chat with us"
        >
          <i className="bi bi-chat-dots text-2xl md:text-3xl"></i>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-[90vw] md:w-[50vw] h-[70vh] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="bi bi-chat-dots text-xl"></i>
              <h3 className="font-semibold">Chat with Admin</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-600 rounded-full py-1 px-2 transition-colors"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-3 text-sm">
                {error}
              </div>
            )}
            
            {messages.length === 0 && !loading ? (
              <div className="text-center text-gray-500 mt-20">
                <i className="bi bi-chat-left-text text-4xl mb-2"></i>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
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

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2 max-w-[100%]">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-0 py-2 max-w-[150px] sm:max-w-[100%] sm:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading || !currentConversationId}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !newMessage.trim() || !currentConversationId}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <i className="bi bi-hourglass-split animate-spin"></i>
                ) : (
                  <i className="bi bi-send"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}