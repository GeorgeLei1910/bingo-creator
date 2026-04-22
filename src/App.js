import "./App.css";
import Homepage from "./rooms/homepage";
import BingoCreator from "./rooms/bingo-creator";
import CreateRoom from "./rooms/create-room";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create-room" element={<CreateRoom />} />
        {/* <Route path="/join-room" element={<JoinRoom />} /> */}
        <Route path="/bingo-creator" element={<BingoCreator />} />
        {/* <Route path="/:roomId" element={<Room />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
