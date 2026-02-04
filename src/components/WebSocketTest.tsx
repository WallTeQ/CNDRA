import React, { useState, useEffect } from 'react';
import { webSocketService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';

export const WebSocketTest: React.FC = () => {
  const [connectionLog, setConnectionLog] = useState<string[]>([]);
  const [testRequestId, setTestRequestId] = useState('test-request-123');
  const [testMessage, setTestMessage] = useState('Hello from frontend!');

  const {
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
  } = useWebSocket();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConnectionLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    // Listen for connection events
    const handleConnected = (data: any) => {
      addLog(`✅ Connected: ${JSON.stringify(data)}`);
    };

    const handleError = (errorData: any) => {
      addLog(`❌ Error: ${JSON.stringify(errorData)}`);
    };

    const handleNewMessage = (message: any) => {
      addLog(`💬 New message: ${message.actorName}: ${message.message}`);
    };

    const handleRequestJoined = (data: any) => {
      addLog(`📁 Joined request: ${data.requestId} with ${data.messages?.length || 0} messages`);
    };

    const handleUserJoined = (data: any) => {
      addLog(`👤 User joined: ${data.userName} (Admin: ${data.isAdmin})`);
    };

    const handleUserTyping = (data: any) => {
      addLog(`⌨️ Typing: ${data.userName} is ${data.isTyping ? 'typing' : 'not typing'}`);
    };

    // Add event listeners
    webSocketService.on('connected', handleConnected);
    webSocketService.on('error', handleError);
    webSocketService.on('newMessage', handleNewMessage);
    webSocketService.on('requestJoined', handleRequestJoined);
    webSocketService.on('userJoined', handleUserJoined);
    webSocketService.on('userTyping', handleUserTyping);

    return () => {
      // Clean up listeners
      webSocketService.off('connected', handleConnected);
      webSocketService.off('error', handleError);
      webSocketService.off('newMessage', handleNewMessage);
      webSocketService.off('requestJoined', handleRequestJoined);
      webSocketService.off('userJoined', handleUserJoined);
      webSocketService.off('userTyping', handleUserTyping);
    };
  }, []);

  const handleConnect = async () => {
    addLog('🔌 Attempting to connect...');
    try {
      await connect();
      addLog('✅ Connection successful!');
    } catch (err) {
      addLog(`❌ Connection failed: ${err}`);
    }
  };

  const handleDisconnect = () => {
    addLog('🔌 Disconnecting...');
    disconnect();
    addLog('✅ Disconnected');
  };

  const handleJoinRequest = () => {
    if (!isConnected) {
      addLog('❌ Not connected. Please connect first.');
      return;
    }
    addLog(`📁 Joining request: ${testRequestId}`);
    joinRequest(testRequestId);
  };

  const handleSendMessage = () => {
    if (!isConnected) {
      addLog('❌ Not connected. Please connect first.');
      return;
    }
    addLog(`💬 Sending message: ${testMessage}`);
    sendMessage(testMessage);
  };

  const handleSendTyping = (isTyping: boolean) => {
    if (!isConnected) {
      addLog('❌ Not connected. Please connect first.');
      return;
    }
    addLog(`⌨️ Sending typing indicator: ${isTyping}`);
    sendTyping(isTyping);
  };

  const clearLog = () => {
    setConnectionLog([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">WebSocket Connection Test</h1>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2`}>
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="font-medium">
              {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {error && (
            <div className="text-red-600 text-sm">
              Error: {error}
            </div>
          )}
        </div>
      </div>

      {/* Connection Controls */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Connection Controls</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleConnect}
            disabled={isConnected || isConnecting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connect
          </button>
          <button
            onClick={handleDisconnect}
            disabled={!isConnected}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Chat Testing */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Chat Testing</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Request ID:</label>
            <input
              type="text"
              value={testRequestId}
              onChange={(e) => setTestRequestId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter request ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Test Message:</label>
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter test message"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleJoinRequest}
              disabled={!isConnected}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Request
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!isConnected}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Message
            </button>
            <button
              onClick={() => handleSendTyping(true)}
              disabled={!isConnected}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Typing
            </button>
            <button
              onClick={() => handleSendTyping(false)}
              disabled={!isConnected}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stop Typing
            </button>
          </div>
        </div>
      </div>

      {/* Messages Display */}
      {messages.length > 0 && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Received Messages ({messages.length})</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="p-2 bg-white rounded border">
                <div className="text-sm font-medium text-gray-700">
                  {msg.actorName} {msg.isAdmin && '(Admin)'}
                </div>
                <div className="text-gray-900">{msg.message}</div>
                <div className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Typing Users */}
      {typingUsers.size > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Currently Typing</h2>
          <div className="text-gray-700">
            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
          </div>
        </div>
      )}

      {/* Connection Log */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Connection Log</h2>
          <button
            onClick={clearLog}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Clear Log
          </button>
        </div>
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-64 overflow-y-auto">
          {connectionLog.length === 0 ? (
            <div className="text-gray-500">No log entries yet...</div>
          ) : (
            connectionLog.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Configuration Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Configuration</h2>
        <div className="text-sm text-gray-700">
          <div><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL}</div>
          <div><strong>WebSocket URL:</strong> {import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}</div>
          <div><strong>WebSocket Namespace:</strong> /access-chat</div>
        </div>
      </div>
    </div>
  );
};