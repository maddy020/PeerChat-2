import { SetStateAction, useEffect, useState } from "react";
import socket from "../util/socket";
import { userTypes } from "../types/userTypes";
const Header = ({
  selectedUserId,
  setOpenVideoCall,
  currUser,
  setConnChangePopup,
}: {
  currUser: userTypes | null;
  setConnChangePopup: React.Dispatch<SetStateAction<boolean>>;
  selectedUserId: string | null;
  setOpenVideoCall: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const from = localStorage.getItem("userID");
  const to = selectedUserId;
  const [typing, setTyping] = useState(false);
  const popupLabel = "Video";
  const handleClick = () => {
    socket.emit("requestConnection", to, from, popupLabel);
    setOpenVideoCall(true);
  };
  useEffect(() => {
    let val: number;
    socket.on("showTyping", () => {
      console.log("in the show typing");
      setTyping(true);
      if (val) clearTimeout(val);
      val = setTimeout(() => {
        setTyping(false);
      }, 1000);
      return () => {
        clearTimeout(val);
      };
    });
  });
  return (
    <div className="flex justify-between p-3  bg-[#252331] rounded-lg shadow-sm shadow-slate-50">
      <div className="flex items-center gap-3">
        <span
          className="material-symbols-outlined text-white md:hidden cursor-pointer"
          onClick={() => {
            setConnChangePopup(true);
          }}
        >
          arrow_back_ios
        </span>
        <img
          src="https://satvision.in/wp-content/uploads/2019/06/user.jpg"
          alt="avatar"
          className="rounded-full h-9 w-9"
        />
        <span className="text-white text-lg font-semibold">
          {currUser?.name}
          {typing && " is typing..."}
        </span>
      </div>
      <div className="flex justify-center gap-3 items-center p-2 rounded-lg border-2 border-white">
        <button
          className="material-symbols-outlined text-white"
          onClick={handleClick}
        >
          videocam
        </button>
        <span className="text-white font-semibold"> | </span>
        <button className="material-symbols-outlined text-white">Call</button>
      </div>
    </div>
  );
};

export default Header;
