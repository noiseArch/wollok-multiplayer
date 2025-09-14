import { WebSocketServer, WebSocket } from "ws";

interface PlayerState {
  id: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
}

const wss = new WebSocketServer({ port: 8080 });
const players: { [id: string]: WebSocket } = {};
const playerStates: { [id: string]: PlayerState } = {};

wss.on("connection", (ws) => {
  let playerId;
  console.log(`Connection created.`);
  ws.on("message", (message) => {
    const data = message.toString().split("|");
    console.log(data);
    const type = data[0];
    playerId = data[1];
    if (type === "player_connected") {
      players[playerId] = ws;
      playerStates[playerId] = { id: playerId, x: 0, y: 0, z: 0, rotation: 0 };
      console.log(`Player connected. ID: ${playerId}`);
      // Send the initial state of the new player to the other connected players
      Object.keys(players).forEach((id) => {
        if (id !== playerId) {
          players[id].send(
            JSON.stringify({
              type: "player_connected",
              player: { id: playerId, ...playerStates[playerId] },
            })
          );
          players[playerId].send(
            JSON.stringify({
              type: "player_connected",
              player: { id, ...playerStates[id] },
            })
          );
        }
      });
    }
    if (type === "update_state") {
      console.log(`Player updated. ID ${playerId}`);
      const [x, y] = data[2].split("@");
      playerStates[playerId].x = Number(x);
      playerStates[playerId].y = Number(y);
      Object.keys(players).forEach((id) => {
        if (id !== playerId) {
          players[id].send(
            JSON.stringify({
              type: "player_update",
              player: { id: playerId, ...playerStates[playerId] },
            })
          );
        }
      });
    }
  });

  ws.on("close", () => {
    console.log(`Player disconnected. ID: ${playerId}`);
    delete players[playerId];
    delete playerStates[playerId];
    Object.keys(players).forEach((id) => {
      players[id].send(
        JSON.stringify({
          type: "player_disconnected",
          player: { id: playerId },
        })
      );
    });
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
