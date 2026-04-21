import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";




export default function CreateRoomPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const url = process.env.MYOBINGO_WS_DEV;

  function handleSubmit(e) {
    e.preventDefault();
    if (!url) {
      console.error("Set REACT_APP_WS_URL in .env");
      return;
    }
  
    const ws = new WebSocket(url);
  
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          action: "createRoom",
          name: name,
        })
      );
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // adjust keys to match your backend
      if (data.roomId) {
        navigate(`/${data.roomId}`, { replace: true, state: { hostName: name } });
      }
      ws.close();
    };
  
    ws.onerror = () => {
      // show error to user
      ws.close();
    };
  }

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/create-room">Create room</Link>
        <Link to="/join-room">Join room</Link>
      </nav>
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