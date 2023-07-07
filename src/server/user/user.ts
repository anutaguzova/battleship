import { WebSocket } from "ws";

import {
  Player,
  RegistrationResponse,
  RegistrationResponseData,
} from "../model/types";

import { players } from "../db";

// Handle player registration
export function handleRegistration(data: string, ws: WebSocket) {
  const userData = JSON.parse(data);

  const playerName = userData.name;
  const playerPassword = userData.password;

  const nameExists = players.find((player) => player.name === playerName);
  const currentUser = players.find(
    (player) => player.name === playerName && player.password === playerPassword
  );
  if (nameExists && !currentUser) {
    const response: RegistrationResponse = {
      type: "reg",
      data: JSON.stringify({
        name: playerName,
        index: 0,
        error: true,
        errorText: "Player name is already existed. Check password",
      }),
      id: 0,
    };

    ws.send(JSON.stringify(response));
    return;
  }

  if (currentUser) {
    const response: RegistrationResponse = {
      type: "reg",
      data: JSON.stringify({
        name: playerName,
        index: 0,
        error: false,
        errorText: "",
      }),
      id: 0,
    };

    ws.send(JSON.stringify(response));
  }

  // Create a new player object
  const newPlayer: Player = {
    name: playerName,
    password: playerPassword,
    index: players.length + 1,
  };

  // Store the new player in the players database
  players.push(newPlayer);

  let dataForSend: RegistrationResponseData = {
    name: playerName,
    index: newPlayer.index,
    error: false,
    errorText: "",
  };

  // send the response
  const response: RegistrationResponse = {
    type: "reg",
    data: JSON.stringify(dataForSend),
    id: 0,
  };

  ws.send(JSON.stringify(response));
}
