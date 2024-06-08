import { DataConnection } from "peerjs";
import { useState, ChangeEvent } from "react";
import { PeerData, PeerDataEnum, messageTypes } from "../types/userTypes";

const MessageInput = ({
  connection,
  messages,
  setMessages,
}: {
  connection: DataConnection | null;
  messages: Array<messageTypes>;
  setMessages: React.Dispatch<React.SetStateAction<Array<messageTypes>>>;
}) => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const from = localStorage.getItem("userID");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as unknown as File;
    setInputFile(file);
  };

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
          className="flex bottom-2 absolute w-full items-center rounded-xl p-2 bg-[#333332]"
        >
          <p>{inputFile.name}</p>
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
          className="flex bottom-2 absolute w-full items-center rounded-xl p-2 bg-[#333332]"
        >
          <label htmlFor="prompt" className="sr-only">
            Enter your Message
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
            <input
              type="file"
              onChange={handleFileChange}
              className="text-white"
            />
          </div>
          <input
            id="prompt"
            required={true}
            value={inputMessage}
            className="mx-2  flex min-h-full resize-none w-full rounded-xl border border-slate-300  p-2 text-base text-slate focus:outline-none focus:ring-1   border-slate-300/20  bg-[#333332]  text-slate-200  placeholder-slate-400  focus:border-[#7d7d7b]  focus:ring-[#20201f]"
            placeholder="Enter your message"
            disabled={inputFile ? true : false}
            onChange={(e) => {
              setInputMessage(e.target.value);
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
      )}
    </>
  );
};

export default MessageInput;
