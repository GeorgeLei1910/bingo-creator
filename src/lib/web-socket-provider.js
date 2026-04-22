const WS_URL = process.env.REACT_APP_WS_URL; // e.g. wss://xyz.execute-api.us-east-1.amazonaws.com/prod

class WebSocketManager {
  constructor() {
    this.ws = null;
    this.listeners = {};       // { actionType: [callback, ...] }
    this.reconnectDelay = 1000;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.shouldReconnect = true;
    this.onStatusChange = null; // optional: (status) => void
  }

  connect() {
    this.shouldReconnect = true;
    this._createSocket();
  }

  disconnect() {
    this.shouldReconnect = false;
    this.ws?.close();
  }

  send(action, payload = {}) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('[WS] Not connected. Message dropped:', action);
      return;
    }
    this.ws.send(JSON.stringify({ action, ...payload }));
  }

  // Register a handler for a specific action type coming FROM the server
  on(action, callback) {
    if (!this.listeners[action]) this.listeners[action] = [];
    this.listeners[action].push(callback);
    return () => this.off(action, callback); // returns unsubscribe fn
  }

  off(action, callback) {
    this.listeners[action] = (this.listeners[action] || []).filter(cb => cb !== callback);
  }

  _createSocket() {
    this._setStatus('connecting');
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this._setStatus('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { action, ...payload } = data;
        const handlers = this.listeners[action] || [];
        handlers.forEach(cb => cb(payload));
        // Also fire wildcard listeners
        (this.listeners['*'] || []).forEach(cb => cb(data));
      } catch (e) {
        console.error('[WS] Failed to parse message:', e);
      }
    };

    this.ws.onerror = (err) => {
      console.error('[WS] Error:', err);
      this._setStatus('error');
    };

    this.ws.onclose = () => {
      this._setStatus('disconnected');
      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        this._setStatus('reconnecting');
        setTimeout(() => this._createSocket(), this.reconnectDelay);
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 15000); // exponential backoff, cap 15s
      }
    };
  }

  _setStatus(status) {
    this.status = status;
    this.onStatusChange?.(status);
  }
}

// Singleton — one connection for your whole app
export const wsManager = new WebSocketManager();