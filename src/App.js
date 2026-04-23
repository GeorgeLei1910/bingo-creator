import "./App.css";
import Homepage from "./rooms/homepage";
import BingoCreator from "./rooms/bingo-creator";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import JoinRoomPage from "./rooms/join-room";
import CreateRoomPage from "./rooms/create-room";
import RoomPage from "./rooms/room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
        <Route path="/join-room/:roomId" element={<JoinRoomPage />} />
        <Route path="/bingo-creator" element={<BingoCreator />} />
        <Route path="/:roomId" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
