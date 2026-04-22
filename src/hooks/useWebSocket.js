import { useEffect, useState, useCallback } from 'react';
import { wsManager } from "../lib/web-socket-provider";

export function useWebSocket() {
  const [status, setStatus] = useState(wsManager.status || 'disconnected');

  useEffect(() => {
    wsManager.onStatusChange = setStatus;
    wsManager.connect();
    return () => {
      wsManager.onStatusChange = null;
    };
  }, []);

  const send = useCallback((action, payload) => {
    wsManager.send(action, payload);
  }, []);

  return { status, send, wsManager };
}