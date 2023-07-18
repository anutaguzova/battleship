import { WebSocket } from "ws";
import { players, rooms, users } from "../db";
import { Player, Room } from "../model/types";

export let counterRoomId = 1;

export function createRoom(data: string, ws: WebSocket) {
  // Create a new room
  const room: Room = {
    id: counterRoomId,
    playersOfGame: [],
  };

  counterRoomId++;

  //Add the player to the room
  const currentplayer = players.find((player) => player.ws == ws);
  const currentId = users.find((user) => user.name === currentplayer?.name)
    ?.index;

  if (currentplayer) {
    room.playersOfGame[0] = currentplayer;
  }

  // Store the room in the rooms object
  rooms.push(room);

  updateRoom();
}

// Handle updating the room
export function updateRoom() {
  const updatedRoomsData = rooms.map((room) => {
    return {
      roomId: room.id,
      roomUsers: room.playersOfGame.map((player) => {
        return {
          name: player.name,
          index: player.index,
        };
      }),
    };
  });

  // Prepare and send response
  const response = {
    type: "update_room",
    data: JSON.stringify(updatedRoomsData),
    id: 0,
  };

  // Send the response to Player1 and Player2 WebSocket connections
  players.map((player) => player.ws.send(JSON.stringify(response)));
}

export function addUserToRoom(data: string, ws: WebSocket) {
  const roomData = JSON.parse(data);

  // Retrieve room ID from data object
  const roomId = roomData.indexRoom;

  const currentplayer = players.find((player) => player.ws == ws);
  const currentId = users.find((user) => user.name === currentplayer?.name)
    ?.index;

  const createGameData = {
    idGame: roomId,
    idPlayer: currentId,
  };

  // Prepare and send response
  const response = {
    type: "create_game",
    data: JSON.stringify(createGameData),
    id: 0,
  };

  console.log("9999999");
  const currentRoom = rooms.filter((room) => room.id === roomId);

  if (currentplayer) {
    currentRoom[0].playersOfGame.push(currentplayer);
  }

  players.map((player) => player.ws.send(JSON.stringify(response)));
  updateRoom();
}
