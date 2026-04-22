import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { wsManager } from "../lib/web-socket-provider";
import Header from "./header";

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [waiting, setWaiting] = useState(false); // ← track if we sent a request

  const { status, send} = useWebSocket();

  useEffect(() => {
    const unsub = wsManager.on('roomCreated', ({roomId}) => {
      if (!waiting) return;
      if (roomId) {
        navigate(`/${roomId}`);
      }
    });
  
    return () => unsub();
  }, [waiting]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!process.env.REACT_APP_WS_URL) {
      console.error("Set REACT_APP_WS_URL in .env");
      return;
    }
    setWaiting(true); // ← flag that we're expecting a response
    send("createRoom", { playerName: name });
  }


  return (
    <div className="app-shell">
      <Header />
      <main className="room-page">
        <h1>Create room</h1>
        <form onSubmit={handleSubmit} className="room-form">
          <label>
            Your name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Host name"
              required
            />
          </label>
          <button type="submit">Create and go to room</button>
        </form>
        {waiting && <p>waiting</p>}
      </main>
    </div>
  );
}
