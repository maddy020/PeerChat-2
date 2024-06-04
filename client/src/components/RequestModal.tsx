import Modal from "react-modal";
import socket from "../util/socket";
import { SetStateAction, useEffect, useState } from "react";
import { userTypes } from "../types/userTypes";
import getUserById from "../backend_calls";

const RequestModal = ({
  peerId,
  to,
  setRequestedId,
  setSelectedUserId,
  setisAllowedToChat,
  popupLabel,
  requestedId,
}: {
  requestedId: string | null;
  peerId: string;
  to: string;
  setRequestedId: React.Dispatch<SetStateAction<string | null>>;
  setSelectedUserId: React.Dispatch<SetStateAction<string | null>>;
  setisAllowedToChat: React.Dispatch<SetStateAction<boolean>>;
  popupLabel: string;
}) => {
  const [userRequested, setUserRequested] = useState<userTypes | null>(null);

  useEffect(() => {
    async function getUser() {
      const data = await getUserById(requestedId);
      setUserRequested(data);
    }
    getUser();
  }, []);
  return (
    <>
      <Modal
        isOpen={true}
        className="w-4/5  bg-white text-black rounded-lg md:h-1/2 md:w-96"
        overlayClassName="overlay"
      >
        <div className="flex flex-col justify-evenly items-center p-2 gap-5">
          <h1 className="font-bold text-lg text-black">
            {userRequested?.name} is Requesting for {popupLabel}
          </h1>
          <div className="flex gap-6">
            <button
              className="bg-green-700 p-1 text-white font-semibold"
              onClick={() => {
                socket.emit(
                  "reqAnswer",
                  peerId,
                  localStorage.getItem("userID"),
                  to,
                  true,
                  popupLabel
                );
                setRequestedId(null);
                setSelectedUserId(to);
                setisAllowedToChat(true);
                if (userRequested)
                  localStorage.setItem("remoteUserId", userRequested._id);
              }}
            >
              Accept
            </button>
            <button
              className="bg-red-700 p-1 text-white font-semibold"
              onClick={() => {
                socket.emit(
                  "reqAnswer",
                  null,
                  localStorage.getItem("userID"),
                  to,
                  false,
                  popupLabel
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
