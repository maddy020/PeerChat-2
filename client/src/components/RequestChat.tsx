import socket from "../util/socket";

const RequestChat = ({ selectedUserId }: { selectedUserId: string | null }) => {
  const popupLabel = "Chat";
  const handleClick = () => {
    socket.emit(
      "requestConnection",
      selectedUserId,
      localStorage.getItem("userID"),
      popupLabel
    );
  };
  return (
    <div className="h-full flex justify-center items-center">
      <button
        onClick={handleClick}
        className="bg-slate-500 p-4 rounded-md text-white cursor-pointer"
      >
        Request Chat
      </button>
    </div>
  );
};

export default RequestChat;
