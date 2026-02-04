// WebSocket types for access chat functionality

export interface WebSocketMessage {
  id: string;
  message: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  type: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface UserJoinedEvent {
  userId: string;
  userName: string;
  isAdmin: boolean;
}

export interface ConnectionEvent {
  message: string;
  userId: string;
  isAdmin: boolean;
}

export interface ErrorEvent {
  message: string;
  details?: string;
}

export interface RequestJoinedEvent {
  requestId: string;
  messages: WebSocketMessage[];
}

export interface NotificationEvent {
  type: string;
  message: string;
  data?: any;
}

export interface MessageReadEvent {
  messageId: string;
  readBy: string;
}

export interface NewRequestMessageEvent {
  requestId: string;
  message: WebSocketMessage;
  requestTitle: string;
}

// WebSocket event types
export type WebSocketEvents = {
  // Client events (sent to server)
  joinRequest: { requestId: string };
  sendMessage: { requestId: string; message: string; type?: string };
  typing: { requestId: string; isTyping: boolean };
  markAsRead: { requestId: string; messageId: string };

  // Server events (received from server)
  connected: ConnectionEvent;
  error: ErrorEvent;
  requestJoined: RequestJoinedEvent;
  newMessage: WebSocketMessage;
  userJoined: UserJoinedEvent;
  userTyping: TypingIndicator;
  messageRead: MessageReadEvent;
  notification: NotificationEvent;
  requestNotification: NotificationEvent;
  newRequestMessage: NewRequestMessageEvent;
};

export interface WebSocketConfig {
  url: string;
  namespace: string;
  autoConnect: boolean;
  reconnection: boolean;
  reconnectionAttempts: number;
  reconnectionDelay: number;
}