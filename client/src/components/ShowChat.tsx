import { SetStateAction, useEffect } from "react";
import { messageTypes, userTypes } from "../types/userTypes";
import VideoCall from "./VideoCall";
import Peer, { DataConnection } from "peerjs";
import RequestChat from "./RequestChat";
import Header from "./Header";
import MessageInput from "./MessageInput";
import getUserById from "../backend_calls";
const ShowChat = ({
  messages,
  setMessages,
  connection,
  selectedUserId,
  openVideoCall,
  setOpenVideoCall,
  currentUserVideoRef,
  remoteVideoRef,
  peer,
  isAllowedToChat,
  currUser,
  setCurrUser,
  setConnChangePopup,
}: {
  currUser: userTypes | null;
  setCurrUser: React.Dispatch<SetStateAction<userTypes | null>>;
  requestedId: string | null;
  messages: Array<messageTypes>;
  setMessages: React.Dispatch<SetStateAction<Array<messageTypes>>>;
  connection: DataConnection | null;
  selectedUserId: string | null;
  openVideoCall: boolean | null;
  setOpenVideoCall: React.Dispatch<SetStateAction<boolean>>;
  currentUserVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  peer: React.RefObject<Peer | null>;
  isAllowedToChat: boolean;
  setConnChangePopup: React.Dispatch<SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    async function getUser() {
      const data = await getUserById(selectedUserId);
      setCurrUser(data);
    }
    getUser();
  }, [selectedUserId]);

  useEffect(() => {
    setMessages([]);
  }, [selectedUserId]);

  return (
    <div className="h-full">
      <Header
        selectedUserId={selectedUserId}
        setOpenVideoCall={setOpenVideoCall}
        currUser={currUser}
        setConnChangePopup={setConnChangePopup}
      />
      {isAllowedToChat === false && selectedUserId !== null && (
        <RequestChat selectedUserId={selectedUserId} />
      )}

      {openVideoCall && (
        <div>
          <VideoCall
            currentUserVideoRef={currentUserVideoRef}
            remoteVideoRef={remoteVideoRef}
            peer={peer}
          />
        </div>
      )}
      {isAllowedToChat === true && (
        <>
          <div className="py-2 px-1 w-full flex flex-col justify-start gap-3 h-[80vh] overflow-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`text-black flex ${
                  message.self === true ? "justify-end" : "justify-start"
                }  `}
              >
                {(message.self === true || message.from === selectedUserId) && (
                  <div className="bg-slate-200 px-2 py-1 rounded-md break-words w-1/2 relative">
                    <p className="font-semibold break-words w-4/5">
                      {message.message}
                    </p>
                    <sub className="absolute bottom-3 right-2">
                      {message.time}
                    </sub>
                  </div>
                )}
              </div>
            ))}
          </div>
          <MessageInput
            connection={connection}
            messages={messages}
            setMessages={setMessages}
          />
        </>
      )}
    </div>
  );
};

export default ShowChat;
