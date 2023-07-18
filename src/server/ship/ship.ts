
import { WebSocket } from "ws";

export function addShips(data: string, ws: WebSocket) {
    console.log("data:" + data)
    const shipData = JSON.parse(data);
    const gameId = shipData.gameId;
    const ships = shipData.ships;
    const indexPlayer = shipData.indexPlayer;
  

  }