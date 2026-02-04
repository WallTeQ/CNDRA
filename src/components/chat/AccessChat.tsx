import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';

interface AccessChatProps {
  requestId: string;
  onClose?: () => void;
}

export const AccessChat: React.FC<AccessChatProps> = ({ requestId, onClose }) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const {
    isConnected,
    isConnecting,
    error,
    messages,
    typingUsers,
    connect,
    sendMessage,
    sendTyping,
    markAsRead,
  } = useWebSocket({ 
    autoConnect: true, 
    requestId 
  });

  // Handle typing indicator
  useEffect(() => {
    if (messageText.length > 0 && !isTyping) {
      setIsTyping(true);
      sendTyping(true);
    } else if (messageText.length === 0 && isTyping) {
      setIsTyping(false);
      sendTyping(false);
    }
  }, [messageText, isTyping, sendTyping]);

  // Stop typing when component unmounts
  useEffect(() => {
    return () => {
      if (isTyping) {
        sendTyping(false);
      }
    };
  }, [isTyping, sendTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && isConnected) {
      sendMessage(messageText.trim());
      setMessageText('');
      setIsTyping(false);
      sendTyping(false);
    }
  };

  const handleMessageClick = (messageId: string) => {
    markAsRead(messageId);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Connection Error</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={connect}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Access Request Chat</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-xs text-gray-500">
            {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="cursor-pointer"
            onClick={() => handleMessageClick(message.id)}
          >
            <div className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.isAdmin
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <div className="text-xs opacity-75 mb-1">
                  {message.actorName} {message.isAdmin && '(Admin)'}
                </div>
                <div className="text-sm">{message.message}</div>
                <div className="text-xs opacity-75 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicators */}
        {typingUsers.size > 0 && (
          <div className="text-sm text-gray-500 italic">
            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
          </div>
        )}
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !messageText.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};