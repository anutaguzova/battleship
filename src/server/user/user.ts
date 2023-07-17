import { WebSocket } from "ws";

import {
  User,
  RegistrationResponse,
  RegistrationResponseData,
  Player,
} from "../model/types";

import { rooms } from "../db";

import { players, users } from "../db";

// Handle player registration
export function handleRegistration(data: string, ws: WebSocket) {
  const userData = JSON.parse(data);

  const userName = userData.name;
  const playerPassword = userData.password;

  const nameExists = users.find((user) => user.name === userName);
  const currentUser = users.find(
    (user) => user.name === userName && user.password === playerPassword
  );
  if (nameExists && !currentUser) {
    const response: RegistrationResponse = {
      type: "reg",
      data: JSON.stringify({
        name: userName,
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
        name: userName,
        index: 0,
        error: false,
        errorText: "",
      }),
      id: 0,
    };

    ws.send(JSON.stringify(response));
  }

  // Create a new player object
  const newUser: User = {
    name: userName,
    password: playerPassword,
    index: users.length + 1,
  };

  const newPlayer: Player = {
    name: userName,
    index: players.length + 1,
    ws: ws
  };

  players.push(newPlayer);

  // Store the new player in the players database
  users.push(newUser);

  let dataForSend: RegistrationResponseData = {
    name: userName,
    index: newUser.index,
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
