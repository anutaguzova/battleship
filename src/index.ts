import { httpServer } from "./http_server/index";
import { WebSocketServer, WebSocket } from "ws";

import { handleRegistration } from "./server/user/user";


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
    // case 'create_room':
    //   createRoom(message.data, ws);
    //   break;
    // case 'add_user_to_room':
    //   addUserToRoom(message.data, ws);
    //   break;
    // case 'add_ships':
    //   addShips(message.data, ws);
    //   break;
    // case 'attack':
    //   handleAttack(message.data, ws);
    //   break;
    // // Handle other message types as needed
    default:
      console.warn("Unknown message type:", messageType);
    // Handle unknown message type if required
  }
}


//   // Handle creating a room
// function createRoom(data, ws) {
//   // Implement create room logic
//   // Perform necessary operations like creating a room, adding the player to it, etc.

//   // Prepare and send response
//   const response = {
//     type: 'create_game',
//     data: {
//       idGame: 0, // Provide appropriate game ID
//       idPlayer: 0, // Provide appropriate player ID
//     },
//     id: 0,
//   };

//   // response.data = JSON.stringify(response.data)
//     ws.send(JSON.stringify(response));
// }

// // Handle adding a user to a room
// function addUserToRoom(data, ws) {
//     data =  JSON.parse(data);
//     // Implement add user to room logic
//     // Retrieve room ID from data object

//     // Perform necessary operations like adding the player to the specified room, removing room from the rooms list, etc.

//     // Prepare and send response
//     const response = {
//       type: 'create_game',
//       data: {
//         idGame: 0, // Provide appropriate game ID
//         idPlayer: 0, // Provide appropriate player ID
//       },
//       id: 0,
//     };

//     // response.data = JSON.stringify(response.data)
//     ws.send(JSON.stringify(response));
//   }
