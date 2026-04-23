import { useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { wsManager } from "../lib/web-socket-provider";
import Header from "./header";
import PlayerList from "./player-list";
import BingoCard from "./bingo-card";

export default function RoomPage() {
  const location = useLocation();
  const { roomName, roomId, gameState, isHost } = location.state ?? {};
  const [players, setPlayers] = useState([]);
  const [currentGameState, setCurrentGameState] = useState(gameState);

  const { status, send } = useWebSocket();

  useEffect(() => {
    const playerJoined = wsManager.on("playerJoined", ({ player }) => {
      setPlayers((prev) => {
        const exists = prev.some((p) => p.connectionId === player.connectionId);
        if (exists) {
          return prev.map((p) =>
            p.connectionId === player.connectionId ? { ...p, ...player } : p,
          );
        }
        return [...prev, { ...player, wins: player.wins ?? 0 }];
      });
    });

    const playerLeft = wsManager.on("playerLeft", ({ connectionId }) => {
      setPlayers((prev) => prev.filter((p) => p.connectionId !== connectionId));
    });

    const gameStarted = wsManager.on("gameStarted", ({ roomId }) => {
      // Game Start in 10 Seconds
      // Show
    });

    const bingoCalled = wsManager.on("bingoCalled", () => {});

    const gameEnd = wsManager.on("gameEnded", (winnerConnectionId) => {
      if (!winnerConnectionId) return;
      setPlayers((prev) =>
        prev.map((p) =>
          p.connectionId === winnerConnectionId
            ? { ...p, wins: (p.wins ?? 0) + 1 }
            : p,
        ),
      );
    });

    return () => {
      playerJoined(); playerLeft(); gameStarted(); bingoCalled(); gameEnd();
    };
  }, []);

  return (
    <div className="app-shell">
      <Header />
      <h1>{roomName}</h1>
      {currentGameState === "READY_TO_PLAY" && (
        <PlayerList players={players}></PlayerList>
      )}
      {currentGameState === "READY_TO_PLAY" && isHost && (
        <button
          type="button"
          onClick={() => send("startGame", { roomId })}
          disabled={status !== "open"}
        >
          Start Game
        </button>
      )}

      {currentGameState === "GAME_IN_PROGRESS" && (
        <button
          type="button"
          onClick={() => send("startGame", { roomId })}
          disabled={status !== "open"}
        >
          BINGO!!!
        </button>
      )}
    </div>
  );
}
