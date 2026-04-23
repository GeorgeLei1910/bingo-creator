import { useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { wsManager } from "../lib/web-socket-provider";
import Header from "./header";

export default function PlayerList({ players }) {
  return (
    <div className="app-shell">
      <h2>Players</h2>
      {players.length === 0 ? (
        <p>No players yet.</p>
      ) : (
        <ul>
          {players.map((p) => (
            <li key={p.connectionId}>
              {p.playerName} - Wins: {p.wins ?? 0}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
