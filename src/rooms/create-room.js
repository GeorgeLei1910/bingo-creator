import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { wsManager } from "../lib/web-socket-provider";
import { useWebSocket } from "../hooks/useWebSocket";
import Header from "./header";

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const { status, send } = useWebSocket();

  useEffect(() => {
    const unsubRoom = wsManager.on("roomCreated", ({ roomCode }) => {
      console.log("Room:", roomCode);
      navigate(`/${roomCode}`);
    });

    return () => unsubRoom();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!process.env.REACT_APP_WS_URL) {
      console.error("Set REACT_APP_WS_URL in .env");
      return;
    }

    send("createRoom", { hostName: name });
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
      </main>
    </div>
  );
}
