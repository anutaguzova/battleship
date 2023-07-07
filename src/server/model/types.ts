export interface Player {
    name: string;
    password: string;
    index: number;
  }

  export interface RegistrationResponse {
    type: string;
    data: RegistrationResponseData | string
    id: number;
}

export interface RegistrationResponseData {
      name: string;
      index: number;
      error: boolean;
      errorText: string;
}