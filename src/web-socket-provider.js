import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
  } from "react";
  
  const WebSocketContext = createContext(null);
  
  /**
   * One app-level WebSocket ref so the connection survives route changes.
   */
  export function WebSocketProvider({ children }) {
    const wsRef = useRef(null);
  
    const disconnect = useCallback(() => {
      const ws = wsRef.current;
      if (!ws) return;
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      try {
        ws.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }, []);
  
    const connect = useCallback(
      (url) =>
        new Promise((resolve, reject) => {
          if (!url || typeof url !== "string") {
            reject(new Error("WebSocket URL is required"));
            return;
          }
  
          disconnect();
  
          const ws = new WebSocket(url);
          wsRef.current = ws;
  
          const onOpen = () => {
            ws.removeEventListener("open", onOpen);
            ws.removeEventListener("error", onError);
            resolve(ws);
          };
  
          const onError = () => {
            ws.removeEventListener("open", onOpen);
            ws.removeEventListener("error", onError);
            if (wsRef.current === ws) {
              wsRef.current = null;
            }
            reject(new Error("WebSocket connection failed"));
          };
  
          ws.addEventListener("open", onOpen);
          ws.addEventListener("error", onError);
  
          ws.addEventListener("close", () => {
            if (wsRef.current === ws) {
              wsRef.current = null;
            }
          });
        }),
      [disconnect]
    );
  
    const getSocket = useCallback(() => wsRef.current, []);
  
    const sendJson = useCallback((payload) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return false;
      }
      ws.send(typeof payload === "string" ? payload : JSON.stringify(payload));
      return true;
    }, []);
  
    const value = useMemo(
      () => ({
        connect,
        disconnect,
        getSocket,
        sendJson,
      }),
      [connect, disconnect, getSocket, sendJson]
    );
  
    return (
      <WebSocketContext.Provider value={value}>
        {children}
      </WebSocketContext.Provider>
    );
  }
  
  export function useWebSocket() {
    const ctx = useContext(WebSocketContext);
    if (!ctx) {
      throw new Error("useWebSocket must be used within WebSocketProvider");
    }
    return ctx;
  }