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
  time: string;
  from: string | null;
  isFile: boolean;
  fileObject: PeerData | null;
}

export enum PeerDataEnum {
  file = "file",
  message = "message",
}

export interface PeerData {
  dataType: PeerDataEnum;
  fileName?: string;
  fileType?: string;
  file?: Blob;
  message?: string;
}
