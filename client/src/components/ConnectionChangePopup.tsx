import { SetStateAction, useEffect, useState } from "react";
import Modal from "react-modal";
import socket from "../util/socket";
import { userTypes } from "../types/userTypes";
import getUserById from "../backend_calls";
const ConnectionChangePopup = ({
  peerId,
  to,
  setRequestedId,
  setSelectedUserId,
  setisAllowedToChat,
  popupLabel,
  requestedId,
  isSender,
  setConnChangePopup,
}: {
  requestedId: string | null;
  peerId: string;
  to: string | null;
  setRequestedId: React.Dispatch<SetStateAction<string | null>>;
  setSelectedUserId: React.Dispatch<SetStateAction<string | null>>;
  setisAllowedToChat: React.Dispatch<SetStateAction<boolean>>;
  popupLabel: string;
  isSender: boolean;
  setConnChangePopup: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [userRequested, setUserRequested] = useState<userTypes | null>(null);
  useEffect(() => {
    async function getUser() {
      const data = await getUserById(requestedId);
      setUserRequested(data);
    }
    if (!isSender) getUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Modal
        isOpen={true}
        className="w-4/5  bg-white text-black rounded-lg border-none outline-none md:h-32 md:w-96"
        overlayClassName="overlay"
      >
        <div className="flex flex-col justify-evenly items-center p-2 gap-5">
          <h1 className="font-bold text-lg text-black">
            All the data will get Erased? Are you sure you want to change the
            connection?
          </h1>
          <div className="flex gap-6">
            <button
              className="bg-green-700 py-2 px-3 rounded-lg  text-white font-semibold"
              onClick={() => {
                setConnChangePopup(false);
                {
                  to !== null
                    ? (() => {
                        socket.emit(
                          "reqAnswer",
                          peerId,
                          localStorage.getItem("userID"),
                          to,
                          true,
                          popupLabel
                        );
                        if (localStorage.getItem("remoteUserId")) {
                          socket.emit(
                            "browserRefresh",
                            localStorage.getItem("remoteUserId")
                          );
                        }
                        setRequestedId(null);
                        setSelectedUserId(to);
                        setisAllowedToChat(true);
                        if (userRequested)
                          localStorage.setItem(
                            "remoteUserId",
                            userRequested._id
                          );
                      })()
                    : window.location.reload();
                }
              }}
            >
              Yes
            </button>
            <button
              className="bg-red-700  py-2 px-3 rounded-lg text-white font-semibold"
              onClick={() => {
                setConnChangePopup(false);
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
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConnectionChangePopup;
