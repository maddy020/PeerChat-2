/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import socket from "../util/socket";
import RequestModal from "./RequestModal";

const RequestChat = ({ selectedUserId }: { selectedUserId: string | null }) => {
  const popupLabel = "Chat";

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    socket.on("reqDeclined", () => {
      alert("Request Declined");
      setVisible(false);
    });
    return () => {
      socket.off("reqDeclined");
    };
  });

  const handleClick = () => {
    socket.emit(
      "requestConnection",
      selectedUserId,
      localStorage.getItem("userID"),
      popupLabel
    );
    setVisible(true);
  };

  return (
    <>
      {visible && (
        <RequestModal
          peerId={""}
          to={selectedUserId as string}
          setRequestedId={() => {}}
          setSelectedUserId={() => {}}
          setisAllowedToChat={() => {}}
          popupLabel={""}
          requestedId={""}
          isSender={true}
          setVisible={setVisible}
        />
      )}
      <div className="h-[91%] flex justify-center items-center">
        <button
          onClick={handleClick}
          className="bg-slate-500 p-4 rounded-md text-white cursor-pointer"
        >
          Request Chat
        </button>
      </div>
    </>
  );
};

export default RequestChat;
