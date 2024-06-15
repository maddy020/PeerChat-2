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
  isSender,
  setVisible,
  selectedUserId,
  setConnChangePopup,
}: {
  requestedId: string | null;
  peerId: string;
  to: string;
  setRequestedId: React.Dispatch<SetStateAction<string | null>>;
  setSelectedUserId: React.Dispatch<SetStateAction<string | null>>;
  setisAllowedToChat: React.Dispatch<SetStateAction<boolean>>;
  popupLabel: string;
  isSender: boolean;
  selectedUserId: string | null;
  setConnChangePopup: React.Dispatch<SetStateAction<boolean>>;
  setVisible: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [userRequested, setUserRequested] = useState<userTypes | null>(null);
  const [seconds, setSeconds] = useState(15);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleDecline();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  useEffect(() => {
    async function getUser() {
      const data = await getUserById(requestedId);
      setUserRequested(data);
    }
    if (!isSender) getUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("reqCancelled", () => {
      setRequestedId(null);
    });
  });

  const handleDecline = () => {
    if (isSender) {
      socket.emit("reqCancelled", to);
      setVisible(false);
    } else {
      socket.emit(
        "reqAnswer",
        null,
        localStorage.getItem("userID"),
        to,
        false,
        popupLabel
      );
      setRequestedId(null);
    }
  };

  return (
    <>
      <Modal
        isOpen={true}
        className="w-4/5 bg-white text-black rounded-lg outline-none border-none md:h-36 md:w-96"
        overlayClassName="overlay"
      >
        {isSender ? (
          <div className="flex flex-col justify-evenly items-center p-2 gap-5">
            <h1>Waiting for response</h1>
            <h3>
              Call will automatically declined after 00:
              {seconds < 10 ? "0" + seconds : seconds}
            </h3>
            <button
              className="bg-red-700 p-1 text-white font-semibold"
              onClick={handleDecline}
            >
              Cancel Request
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-evenly items-center p-2 gap-5">
            <h1 className="font-bold text-lg text-black">
              {userRequested?.name} is Requesting for {popupLabel}
            </h1>

            {
              <h3>
                Call will automatically declined after 00:
                {seconds < 10 ? "0" + seconds : seconds}
              </h3>
            }
            <div className="flex gap-6">
              <button
                className="bg-green-700 p-1 text-white font-semibold"
                onClick={() => {
                  {
                    selectedUserId
                      ? popupLabel === "Chat"
                        ? setConnChangePopup(true)
                        : setRequestedId(null)
                      : (() => {
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
                            localStorage.setItem(
                              "remoteUserId",
                              userRequested._id
                            );
                        })();
                  }
                }}
              >
                Accept
              </button>
              <button
                className="bg-red-700 p-1 text-white font-semibold"
                onClick={handleDecline}
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RequestModal;
