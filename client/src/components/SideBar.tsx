import { SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../util/socket";
const SideBar = ({
  setisLoggedIn,
}: {
  setisLoggedIn: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between md:flex-col md:justify-between md:h-full">
      <div className="flex gap-6 items-center cursor-pointer md:flex-col">
        <span className="material-symbols-outlined hidden text-white">
          Menu
        </span>
        <span className="material-symbols-outlined text-white">Message</span>
        <span className="material-symbols-outlined text-white">Call</span>
      </div>
      <div className="flex gap-6 items-center cursor-pointer md:flex-col">
        <span className="material-symbols-outlined text-white">Star</span>
        <span className="material-symbols-outlined text-white">Archive</span>
        <span
          onClick={async () => {
            console.log("logout");
            socket.emit("browserRefresh", localStorage.getItem("remoteUserId"));
            socket.emit("logout", localStorage.getItem("userID"));
            localStorage.removeItem("authtoken");
            localStorage.removeItem("userID");
            localStorage.removeItem("remoteUserId");
            setisLoggedIn(false);
            navigate("/login");
          }}
          className="material-symbols-outlined text-white"
        >
          logout
        </span>
        <span>
          <img
            src="https://satvision.in/wp-content/uploads/2019/06/user.jpg"
            alt="avatar"
            className="rounded-full h-8 w-8 border-white border-2"
          />
        </span>
      </div>
    </div>
  );
};

export default SideBar;
