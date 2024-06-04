import { SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
const SideBar = ({
  setisLoggedIn,
}: {
  setisLoggedIn: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between">
      <div className="flex gap-6 items-center">
        <span className="material-symbols-outlined hidden text-white ">
          Menu
        </span>
        <span className="material-symbols-outlined text-white">Message</span>
        <span className="material-symbols-outlined text-white">Call</span>
      </div>
      <div className="flex gap-6 items-center">
        <span className="material-symbols-outlined text-white">Star</span>
        <span className="material-symbols-outlined text-white">Archive</span>
        <span
          onClick={() => {
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
