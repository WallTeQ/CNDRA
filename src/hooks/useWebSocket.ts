import { useEffect, useRef, useCallback, useState } from 'react';
import { webSocketService } from '../services/webSocket';
import type { 
  WebSocketMessage,
  TypingIndicator,
  UserJoinedEvent,
  NotificationEvent
} from '../types/websocket';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  requestId?: string;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  messages: WebSocketMessage[];
  typingUsers: Set<string>;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: string, type?: string) => void;
  joinRequest: (requestId: string) => void;
  sendTyping: (isTyping: boolean) => void;
  markAsRead: (messageId: string) => void;
  clearMessages: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const { autoConnect = false, requestId } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  
  const currentRequestId = useRef<string | null>(null);
  const typingTimeouts = useRef<Map<string, number>>(new Map());

  // Event handlers
  const handleConnected = useCallback(() => {
    setIsConnected(true);
    setIsConnecting(false);
    setError(null);
  }, []);

  const handleError = useCallback((errorData: { message: string; details?: string }) => {
    setError(errorData.message);
    setIsConnecting(false);
    setIsConnected(false);
  }, []);

  const handleNewMessage = useCallback((message: WebSocketMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleRequestJoined = useCallback((data: { requestId: string; messages: WebSocketMessage[] }) => {
    setMessages(data.messages);
    currentRequestId.current = data.requestId;
  }, []);

  const handleUserJoined = useCallback((data: UserJoinedEvent) => {
    console.log('User joined:', data);
    // You can add additional logic here, like showing a notification
  }, []);

  const handleUserTyping = useCallback((data: TypingIndicator) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev);
      
      // Clear existing timeout for this user
      const existingTimeout = typingTimeouts.current.get(data.userId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }
      
      if (data.isTyping) {
        newSet.add(data.userName);
        
        // Set timeout to remove typing indicator after 3 seconds
        const timeout = setTimeout(() => {
          setTypingUsers(current => {
            const updated = new Set(current);
            updated.delete(data.userName);
            return updated;
          });
          typingTimeouts.current.delete(data.userId);
        }, 3000);
        
        typingTimeouts.current.set(data.userId, timeout);
      } else {
        newSet.delete(data.userName);
        typingTimeouts.current.delete(data.userId);
      }
      
      return newSet;
    });
  }, []);

  const handleNotification = useCallback((notification: NotificationEvent) => {
    console.log('Notification received:', notification);
    // You can add notification display logic here
  }, []);

  // Connect function
  const connect = useCallback(async (): Promise<void> => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      await webSocketService.connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected]);

  // Disconnect function
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
    setMessages([]);
    setTypingUsers(new Set());
    currentRequestId.current = null;
    
    // Clear all typing timeouts
    typingTimeouts.current.forEach(timeout => clearTimeout(timeout));
    typingTimeouts.current.clear();
  }, []);

  // Send message function
  const sendMessage = useCallback((message: string, type = 'message') => {
    if (!currentRequestId.current) {
      console.warn('No request joined');
      return;
    }
    webSocketService.sendMessage(currentRequestId.current, message, type);
  }, []);

  // Join request function
  const joinRequest = useCallback((reqId: string) => {
    webSocketService.joinRequest(reqId);
    currentRequestId.current = reqId;
  }, []);

  // Send typing indicator
  const sendTyping = useCallback((isTyping: boolean) => {
    if (!currentRequestId.current) return;
    webSocketService.sendTyping(currentRequestId.current, isTyping);
  }, []);

  // Mark message as read
  const markAsRead = useCallback((messageId: string) => {
    if (!currentRequestId.current) return;
    webSocketService.markAsRead(currentRequestId.current, messageId);
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Setup event listeners
  useEffect(() => {
    // Add event listeners
    webSocketService.on('connected', handleConnected);
    webSocketService.on('error', handleError);
    webSocketService.on('newMessage', handleNewMessage);
    webSocketService.on('requestJoined', handleRequestJoined);
    webSocketService.on('userJoined', handleUserJoined);
    webSocketService.on('userTyping', handleUserTyping);
    webSocketService.on('notification', handleNotification);

    // Check initial connection state
    setIsConnected(webSocketService.isConnected());

    return () => {
      // Remove event listeners
      webSocketService.off('connected', handleConnected);
      webSocketService.off('error', handleError);
      webSocketService.off('newMessage', handleNewMessage);
      webSocketService.off('requestJoined', handleRequestJoined);
      webSocketService.off('userJoined', handleUserJoined);
      webSocketService.off('userTyping', handleUserTyping);
      webSocketService.off('notification', handleNotification);
      
      // Clear typing timeouts
      typingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      typingTimeouts.current.clear();
    };
  }, [
    handleConnected,
    handleError,
    handleNewMessage,
    handleRequestJoined,
    handleUserJoined,
    handleUserTyping,
    handleNotification
  ]);

  // Auto-connect if enabled
  useEffect(() => {
    if (autoConnect && !isConnected && !isConnecting) {
      connect();
    }
  }, [autoConnect, isConnected, isConnecting, connect]);

  // Auto-join request if provided
  useEffect(() => {
    if (requestId && isConnected && requestId !== currentRequestId.current) {
      joinRequest(requestId);
    }
  }, [requestId, isConnected, joinRequest]);

  return {
    isConnected,
    isConnecting,
    error,
    messages,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    joinRequest,
    sendTyping,
    markAsRead,
    clearMessages,
  };
};

// Hook for admin notifications
export const useWebSocketNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [newRequestMessages, setNewRequestMessages] = useState<any[]>([]);

  const handleNotification = useCallback((notification: NotificationEvent) => {
    setNotifications(prev => [...prev, notification]);
  }, []);

  const handleNewRequestMessage = useCallback((data: any) => {
    setNewRequestMessages(prev => [...prev, data]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearRequestMessages = useCallback(() => {
    setNewRequestMessages([]);
  }, []);

  useEffect(() => {
    webSocketService.on('notification', handleNotification);
    webSocketService.on('newRequestMessage', handleNewRequestMessage);

    return () => {
      webSocketService.off('notification', handleNotification);
      webSocketService.off('newRequestMessage', handleNewRequestMessage);
    };
  }, [handleNotification, handleNewRequestMessage]);

  return {
    notifications,
    newRequestMessages,
    clearNotifications,
    clearRequestMessages,
  };
};