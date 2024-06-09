import { SetStateAction, useEffect } from "react";
import { messageTypes, userTypes } from "../types/userTypes";
import VideoCall from "./VideoCall";
import Peer, { DataConnection } from "peerjs";
import RequestChat from "./RequestChat";
import Header from "./Header";
import MessageInput from "./MessageInput";
import getUserById from "../backend_calls";
import fileDownload from "js-file-download";
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  return (
    <div className="h-full relative">
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
          <div className="py-2 px-1 w-full flex flex-col justify-start gap-3 h-[80vh] overflow-auto md:px-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`text-black flex ${
                  message.self === true ? "justify-end " : "justify-start"
                } ${message.isFile ? "items-center" : ""}`}
              >
                {(message.self === true ||
                  message.from === selectedUserId ||
                  message.isFile) && (
                  <div
                    className={`bg-slate-200 px-2 py-1 rounded-md break-words flex items-center ${
                      message.isFile
                        ? "w-auto max-w-[80%] h-20 "
                        : "w-auto max-w-[50%] "
                    } 
                    }`}
                  >
                    {message.isFile ? (
                      <div className="flex flex-col justify-between gap-1">
                        <div
                          onClick={() =>
                            fileDownload(
                              message.fileObject?.file as Blob,
                              message.fileObject?.fileName as string
                            )
                          }
                          className="flex text-xs md:text-md justify-between  items-center cursor-pointer bg-slate-300 p-1 h-12 rounded-md w-full"
                        >
                          <span className="material-symbols-outlined w-1/8">
                            description
                          </span>
                          <span className="w-auto ">
                            {message.fileObject?.fileName}
                          </span>
                          <span className="material-symbols-outlined w-1/8 ">
                            download_for_offline
                          </span>
                        </div>
                        <div className="flex justify-end">
                          <p className="text-xs">{message.time}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <p className="font-semibold break-all">
                          {message.message}
                        </p>
                        <p className="flex justify-end text-xs">
                          {message.time}
                        </p>
                      </div>
                    )}
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
