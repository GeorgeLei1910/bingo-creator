import React from "react";
import "./homepage.css";
import { Link } from "react-router-dom";

const Homepage = ({}) => {
  return (
    <div class="homepage">
      <h1>MYOBINGO</h1>
      <div class="button-array">
        <Link className="button" to="/create-room">Create Room</Link>
        <Link className="button" to="/join-room">Join Room</Link>
        <Link className="button" to="/bingo-creator">Bingo Creator</Link>
      </div>
    </div>
  );
};

export default Homepage;
