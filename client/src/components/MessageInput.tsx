import { DataConnection } from "peerjs";
import { useState, ChangeEvent } from "react";
import { PeerData, PeerDataEnum, messageTypes } from "../types/userTypes";
import socket from "../util/socket";
import UploadFileInput from "./UploadFile";

const MessageInput = ({
  connection,
  messages,
  setMessages,
  selectedUserId,
}: {
  connection: DataConnection | null;
  messages: Array<messageTypes>;
  setMessages: React.Dispatch<React.SetStateAction<Array<messageTypes>>>;
  selectedUserId: string | null;
}) => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const from = localStorage.getItem("userID");

  return (
    <>
      {inputFile ? (
        <form
          onSubmit={async (e: ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();
            let data: PeerData | null = null;
            if (inputFile) {
              const blob = new Blob([inputFile], { type: inputFile.type });
              data = {
                dataType: PeerDataEnum.file,
                file: blob,
                fileName: inputFile.name,
                fileType: inputFile.type,
              };
              await connection?.send(data);
              setInputFile(null);
              e.target.reset();
            }
            connection?.send({
              message: from + inputMessage,
              dataType: "message",
            });
            let currtime = new Date().toLocaleTimeString().substring(0, 5);
            if (currtime[currtime.length - 1] === ":")
              currtime = currtime.substring(0, 4);
            setMessages([
              ...messages,
              {
                self: true,
                message: inputMessage,
                time: currtime,
                from: from,
                isFile: true,
                fileObject: data,
              },
            ]);
          }}
          className="flex border-slate-500 border-t-2 justify-between bottom-0 absolute w-full items-center p-2"
        >
          <div className="flex items-center gap-3 bg-white overflow-auto break-words break-all px-2 rounded-lg relative h-11 w-auto ">
            <span className="material-symbols-outlined w-1/8">description</span>
            <p>{inputFile.name}</p>
            <span
              className="static right-0 top-0 cursor-pointer "
              onClick={() => setInputFile(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#000000"
              >
                <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
              </svg>
            </span>
          </div>
          <div>
            <button
              className="inline-flex text-slate-200 hover:text-[#7d7d7b] sm:p-2"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                aria-hidden="true"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="#184ffc"
                fill="#184ffc"
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
      ) : (
        <form
          onSubmit={async (e: ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();
            connection?.send({
              message: from + inputMessage,
              dataType: "message",
            });
            setInputMessage("");
            let currtime = new Date().toLocaleTimeString().substring(0, 5);
            if (currtime[currtime.length - 1] === ":")
              currtime = currtime.substring(0, 4);
            setMessages([
              ...messages,
              {
                self: true,
                message: inputMessage,
                time: currtime,
                from: from,
                isFile: false,
                fileObject: null,
              },
            ]);
          }}
          className="flex bottom-0 absolute w-full items-center p-2 border-t-[1px] border-slate-100"
        >
          <label htmlFor="prompt" className="sr-only">
            Enter your Message
          </label>
          <div>
            <UploadFileInput setInputFile={setInputFile} />
          </div>
          <input
            id="prompt"
            required={true}
            value={inputMessage}
            className="mx-2  flex min-h-full resize-none w-full outline-none border-none px-2 py-4 bg-[#252331] text-slate-300 font-semibold"
            placeholder="Enter your message"
            disabled={inputFile ? true : false}
            onChange={(e) => {
              setInputMessage(e.target.value);
              socket.emit(
                "typing",
                selectedUserId,
                localStorage.getItem("userID")
              );
            }}
          />
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
                stroke="#184ffc"
                fill="#184ffc"
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
      )}
    </>
  );
};

export default MessageInput;
