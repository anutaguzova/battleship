import { players } from './../db';
import { WebSocket } from "ws";
export interface User {
  name: string;
  password: string;
  index: number;
}

export interface RegistrationResponse {
  type: string;
  data: RegistrationResponseData | string;
  id: number;
}

export interface RegistrationResponseData {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
}

export interface Player {
  name: string;
  index: number;
  ws : WebSocket;
}

export interface Room {
  id: number;
  playersOfGame: Player[];
}