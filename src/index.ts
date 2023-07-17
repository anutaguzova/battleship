import { httpServer } from "./http_server/index";
import { WebSocketServer, WebSocket } from "ws";

import { handleRegistration } from "./server/user/user";
import { createRoom, updateRoom, addUserToRoom } from "./server/room/room";
import { addShips } from "./server/ship/ship";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

// Create a WebSocket server
const wss = new WebSocketServer({ port: 3000 });

// Handle WebSocket connections
wss.on("connection", (ws: WebSocket) => {
  console.log("A client connected");

  // Handle WebSocket message received
  ws.on("message", (message) => {
    console.log("Received message:", message);
    const parsedMessage = JSON.parse(
      Buffer.from(message as Buffer).toString("utf8")
    );
    console.log(parsedMessage);
    processMessage(parsedMessage, ws);
  });

  // Handle WebSocket disconnections
  ws.on("close", () => {
    console.log("A client disconnected");
  });
});

// Process the WebSocket message based on its type
function processMessage(message: { type: string; data: any }, ws: WebSocket) {
  const messageType = message.type;

  switch (messageType) {
    case "reg":
      handleRegistration(message.data, ws);
      break;
    case "update_room":
      updateRoom();
      break;
    case "create_room":
      createRoom(message.data, ws);
      break;
    case "add_user_to_room":
      addUserToRoom(message.data, ws);
      break;
    case "add_ships":
      addShips(message.data, ws);
      break;
    default:
      console.warn("Unknown message type:", messageType);
  }
}
