import { SetStateAction } from "react";
import socket from "../util/socket";

const Header = ({
  selectedUserId,
  setOpenVideoCall,
}: {
  selectedUserId: string | null;
  setOpenVideoCall: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const from = localStorage.getItem("userID");
  const to = selectedUserId;
  const popupLabel = "Video";
  const handleClick = () => {
    socket.emit("requestConnection", to, from, popupLabel);
    setOpenVideoCall(true);
  };
  return (
    <div className="flex justify-between">
      <button onClick={handleClick}>Video</button>
      <button>Audio</button>
    </div>
  );
};

export default Header;
