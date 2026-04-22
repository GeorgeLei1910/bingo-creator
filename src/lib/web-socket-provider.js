const WS_URL = process.env.REACT_APP_WS_URL;

// WebSocket close codes → human-readable reason
const CLOSE_CODES = {
  1000: 'Normal closure',
  1001: 'Endpoint going away',
  1002: 'Protocol error',
  1003: 'Unsupported data',
  1006: 'Abnormal closure (no internet?)',
  1007: 'Invalid frame payload',
  1008: 'Policy violation',
  1009: 'Message too large',
  1011: 'Internal server error',
  1015: 'TLS handshake failed',
};

class WebSocketManager {
  constructor() {
    this.ws = null;
    this.listeners = {};
    this.statusListeners = new Set(); // ← Set instead of single slot
    this.messageQueue = [];           // ← queue messages while reconnecting
    this.reconnectDelay = 1000;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.shouldReconnect = true;
    this.status = 'disconnected';
  }

  connect() {
    // ← guard against double-connect
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      console.warn('[WS] Already connected or connecting');
      return;
    }
    if (!WS_URL) {
      console.error('[WS] REACT_APP_WS_URL is not set');
      return;
    }
    this.shouldReconnect = true;
    this._createSocket();
  }

  disconnect() {
    this.shouldReconnect = false;
    this.messageQueue = [];
    this.ws?.close(1000, 'User disconnected');
  }

  send(action, payload = {}) {
    const frame = JSON.stringify({ action, ...payload });
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WS] Sending:', action, payload);
      this.ws.send(frame);
    } else if (this.status === 'reconnecting') {
      console.warn('[WS] Reconnecting — queueing message:', action);
      this.messageQueue.push(frame); // ← queue instead of drop
    } else {
      console.warn('[WS] Not connected. Message dropped:', action);
    }
  }

  on(action, callback) {
    if (!this.listeners[action]) this.listeners[action] = [];
    this.listeners[action].push(callback);
    return () => this.off(action, callback);
  }

  off(action, callback) {
    this.listeners[action] = (this.listeners[action] || []).filter(cb => cb !== callback);
  }

  // ← any number of components can subscribe to status
  onStatusChange(callback) {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  _createSocket() {
    this._setStatus('connecting');
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('[WS] Connected');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this._setStatus('connected');

      // ← flush queued messages
      while (this.messageQueue.length > 0) {
        this.ws.send(this.messageQueue.shift());
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[WS] Received:', data);
        const { action, ...payload } = data;
        (this.listeners[action] || []).forEach(cb => cb(payload));
        (this.listeners['*'] || []).forEach(cb => cb(data));
      } catch (e) {
        console.error('[WS] Failed to parse message. Raw:', event.data, e);
      }
    };

    // ← onerror just flags it; onclose has the real info
    this.ws.onerror = () => {
      console.error('[WS] Socket error — see onclose for details');
      this._setStatus('error');
    };

    this.ws.onclose = (event) => {
      const reason = event.reason || CLOSE_CODES[event.code] || 'Unknown reason';
      console.warn(`[WS] Closed — code: ${event.code}, reason: ${reason}, clean: ${event.wasClean}`);
      this._setStatus('disconnected');

      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`[WS] Reconnecting in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this._setStatus('reconnecting');
        setTimeout(() => this._createSocket(), this.reconnectDelay);
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 15000);
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[WS] Max reconnect attempts reached. Giving up.');
        this._setStatus('failed');
      }
    };
  }

  _setStatus(status) {
    this.status = status;
    this.statusListeners.forEach(cb => cb(status)); // ← notify all subscribers
  }
}

export const wsManager = new WebSocketManager();