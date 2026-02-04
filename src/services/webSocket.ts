import { io, Socket } from 'socket.io-client';
import { tokenManager } from './api-config/tokenManager';
import { API_BASE_URL } from './api-config/config';
import type { 
  WebSocketEvents, 
  WebSocketConfig, 
  WebSocketMessage,
  ConnectionEvent,
  ErrorEvent,
  RequestJoinedEvent,
  UserJoinedEvent,
  TypingIndicator,
  MessageReadEvent,
  NotificationEvent,
  NewRequestMessageEvent
} from '../types/websocket';

class WebSocketService {
  private socket: Socket | null = null;
  private config: WebSocketConfig;
  private isConnecting = false;
  private eventListeners = new Map<string, Set<Function>>();
  private currentRequestId: string | null = null;

  constructor() {
    // Extract base URL without the /api/v1 path for WebSocket connection
    const baseUrl = API_BASE_URL.replace('/api/v1', '');
    
    this.config = {
      url: baseUrl,
      namespace: '/access-chat',
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    };
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Wait for existing connection attempt
        const checkConnection = () => {
          if (this.socket?.connected) {
            resolve();
          } else if (!this.isConnecting) {
            reject(new Error('Connection attempt failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
        return;
      }

      const token = tokenManager.getToken();
      if (!token) {
        reject(new Error('No authentication token available'));
        return;
      }

      this.isConnecting = true;

      try {
        this.socket = io(`${this.config.url}${this.config.namespace}`, {
          auth: {
            token: token,
          },
          autoConnect: this.config.autoConnect,
          reconnection: this.config.reconnection,
          reconnectionAttempts: this.config.reconnectionAttempts,
          reconnectionDelay: this.config.reconnectionDelay,
          transports: ['websocket', 'polling'],
        });

        this.setupEventHandlers();

        // Handle connection success
        this.socket.on('connected', (data: ConnectionEvent) => {
          this.isConnecting = false;
          console.log('✅ WebSocket connected:', data);
          this.emit('connected', data);
          resolve();
        });

        // Handle connection errors
        this.socket.on('connect_error', (error: any) => {
          this.isConnecting = false;
          console.error('❌ WebSocket connection error:', error);
          this.emit('error', { message: 'Connection failed', details: error.message });
          reject(error);
        });

        // Handle authentication errors
        this.socket.on('error', (error: ErrorEvent) => {
          this.isConnecting = false;
          console.error('❌ WebSocket authentication error:', error);
          this.emit('error', error);
          reject(new Error(error.message));
        });

        // Attempt to connect
        this.socket.connect();

      } catch (error) {
        this.isConnecting = false;
        console.error('❌ WebSocket setup error:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.currentRequestId = null;
      this.isConnecting = false;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Join a specific access request room
   */
  joinRequest(requestId: string): void {
    if (!this.socket?.connected) {
      console.warn('⚠️ WebSocket not connected');
      return;
    }

    this.currentRequestId = requestId;
    this.socket.emit('joinRequest', { requestId });
    console.log(`📁 Joining request room: ${requestId}`);
  }

  /**
   * Send a message to the current request room
   */
  sendMessage(requestId: string, message: string, type = 'message'): void {
    if (!this.socket?.connected) {
      console.warn('⚠️ WebSocket not connected');
      return;
    }

    this.socket.emit('sendMessage', { requestId, message, type });
    console.log(`💬 Message sent to request ${requestId}`);
  }

  /**
   * Send typing indicator
   */
  sendTyping(requestId: string, isTyping: boolean): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('typing', { requestId, isTyping });
  }

  /**
   * Mark a message as read
   */
  markAsRead(requestId: string, messageId: string): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('markAsRead', { requestId, messageId });
  }

  /**
   * Add event listener
   */
  on<K extends keyof WebSocketEvents>(event: K, callback: (data: WebSocketEvents[K]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  /**
   * Remove event listener
   */
  off<K extends keyof WebSocketEvents>(event: K, callback: (data: WebSocketEvents[K]) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  /**
   * Emit event to listeners
   */
  private emit<K extends keyof WebSocketEvents>(event: K, data: WebSocketEvents[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Server event handlers
    this.socket.on('requestJoined', (data: RequestJoinedEvent) => {
      console.log(`📁 Joined request room: ${data.requestId}`);
      this.emit('requestJoined', data);
    });

    this.socket.on('newMessage', (data: WebSocketMessage) => {
      console.log('💬 New message received:', data);
      this.emit('newMessage', data);
    });

    this.socket.on('userJoined', (data: UserJoinedEvent) => {
      console.log('👤 User joined:', data);
      this.emit('userJoined', data);
    });

    this.socket.on('userTyping', (data: TypingIndicator) => {
      this.emit('userTyping', data);
    });

    this.socket.on('messageRead', (data: MessageReadEvent) => {
      this.emit('messageRead', data);
    });

    this.socket.on('notification', (data: NotificationEvent) => {
      console.log('🔔 Notification received:', data);
      this.emit('notification', data);
    });

    this.socket.on('requestNotification', (data: NotificationEvent) => {
      console.log('🔔 Request notification received:', data);
      this.emit('requestNotification', data);
    });

    this.socket.on('newRequestMessage', (data: NewRequestMessageEvent) => {
      console.log('📨 New request message for admin:', data);
      this.emit('newRequestMessage', data);
    });

    // Connection events
    this.socket.on('connect', () => {
      console.log('🔌 WebSocket connected');
    });

    this.socket.on('disconnect', (reason: any) => {
      console.log('🔌 WebSocket disconnected:', reason);
      this.currentRequestId = null;
    });

    this.socket.on('reconnect', (attemptNumber: any) => {
      console.log(`🔄 WebSocket reconnected after ${attemptNumber} attempts`);
      
      // Rejoin current request if we were in one
      if (this.currentRequestId) {
        setTimeout(() => {
          this.joinRequest(this.currentRequestId!);
        }, 1000);
      }
    });

    this.socket.on('reconnect_error', (error: any) => {
      console.error('🔄 WebSocket reconnection error:', error);
    });
  }

  /**
   * Get current request ID
   */
  getCurrentRequestId(): string | null {
    return this.currentRequestId;
  }

  /**
   * Force reconnection with new token
   */
  reconnectWithNewToken(): Promise<void> {
    this.disconnect();
    return this.connect();
  }
}

// Create and export a singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;
