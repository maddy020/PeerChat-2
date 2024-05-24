import Modal from "react-modal";
import socket from "../util/socket";
import { SetStateAction, useEffect } from "react";

const RequestModal = ({
  peerId,
  to,
  setRequestedId,
  setSelectedUserId,
}: {
  peerId: string;
  to: string;
  setRequestedId: React.Dispatch<SetStateAction<string | null>>;
  setSelectedUserId: React.Dispatch<SetStateAction<string | null>>;
}) => {
  useEffect(() => {
    Modal.setAppElement("body");
  });

  return (
    <>
      <Modal
        isOpen={true}
        className="w-4/5 h-2/3 bg-white text-black rounded-3xl md:h-1/2 md:w-96"
        overlayClassName="overlay"
      >
        <div className="flex flex-col justify-evenly items-center p-2">
          <h1 className="font-bold text-xl text-orange-500">
            User is Requesting to Chat
          </h1>
          <div className="flex justify-around">
            <button
              onClick={() => {
                socket.emit(
                  "reqAnswer",
                  peerId,
                  localStorage.getItem("userID"),
                  to,
                  true
                );
                setSelectedUserId(to);
              }}
            >
              Accept
            </button>
            <button
              onClick={() => {
                socket.emit(
                  "reqAnswer",
                  null,
                  localStorage.getItem("userID"),
                  to,
                  false
                );
                setRequestedId(null);
              }}
            >
              Decline
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RequestModal;
