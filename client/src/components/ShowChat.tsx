import { ChangeEvent, SetStateAction, useState } from "react";
import { messageTypes } from "../types/userTypes";
import VideoCall from "./VideoCall";
import Peer, { DataConnection } from "peerjs";

import Header from "./Header";
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
}: {
  messages: Array<messageTypes>;
  setMessages: React.Dispatch<SetStateAction<Array<messageTypes>>>;
  connection: DataConnection | null;
  selectedUserId: string | null;
  openVideoCall: boolean | null;
  setOpenVideoCall: React.Dispatch<SetStateAction<boolean>>;
  currentUserVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  peer: React.RefObject<Peer | null>;
}) => {
  const [inputMessage, setInputMessage] = useState<string>("");

  return (
    <div className="h-full">
      <Header
        selectedUserId={selectedUserId}
        setOpenVideoCall={setOpenVideoCall}
      />
      {openVideoCall && (
        <div>
          <VideoCall
            currentUserVideoRef={currentUserVideoRef}
            remoteVideoRef={remoteVideoRef}
            peer={peer}
          />
        </div>
      )}
      <div>
        {messages.map((message, index) => (
          <div key={index} className="text-black bg-green-500">
            {message.message}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
          e.preventDefault();
          connection?.send(inputMessage);
          setInputMessage("");
          setMessages([...messages, { self: true, message: inputMessage }]);
        }}
        className="flex bottom-2 absolute w-full items-center rounded-xl p-2 bg-[#333332]"
      >
        <label htmlFor="prompt" className="sr-only">
          Enter your prompt
        </label>
        <div>
          <button
            className="  text-slate-200  hover:text-[#7d7d7b] sm:p-2"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              aria-hidden="true"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 5l0 14"></path>
              <path d="M5 12l14 0"></path>
            </svg>
            <span className="sr-only">Attach file</span>
          </button>
        </div>
        <input
          id="prompt"
          required={true}
          value={inputMessage}
          className="mx-2  flex min-h-full resize-none w-full rounded-xl border border-slate-300  p-2 text-base text-slate focus:outline-none focus:ring-1   border-slate-300/20  bg-[#333332]  text-slate-200  placeholder-slate-400  focus:border-[#7d7d7b]  focus:ring-[#20201f]"
          placeholder="Enter your message"
          onChange={(e) => {
            setInputMessage(e.target.value);
          }}
        ></input>
        <div>
          <button
            className="inline-flex  text-slate-200  hover:text-[#7d7d7b] sm:p-2"
            type="submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              aria-hidden="true"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="#C62744"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M10 14l11 -11"></path>
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShowChat;
