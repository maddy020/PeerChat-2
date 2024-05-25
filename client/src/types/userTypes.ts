export interface userTypes {
  _id: string;
  username: string;
  name: string;
  password: string;
  peerId: string;
}

export interface messageTypes {
  self: boolean;
  message: string;
}
