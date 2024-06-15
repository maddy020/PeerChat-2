import { SetStateAction, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { userTypes } from "../types/userTypes";
import socket from "../util/socket";
const Contacts = ({
  allUsers,
  setSelectedUserId,
  userData,
  setUserData,
  setConnChangePopup,
  isUserFetching,
  selectedUserId,
}: {
  allUsers: userTypes[];
  setSelectedUserId: React.Dispatch<SetStateAction<string | null>>;
  userData: userTypes[];
  setUserData: React.Dispatch<SetStateAction<userTypes[]>>;
  setConnChangePopup: React.Dispatch<SetStateAction<boolean>>;
  isUserFetching: boolean;
  selectedUserId: string | null;
}) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  useEffect(() => {
    socket.on("onlineUsers", (onlineUsersArr: string[]) => {
      setOnlineUsers(onlineUsersArr);
    });
  });
  return (
    <>
      <h1 className="font-semibold text-xl pl-4 md:pb-4 text-white">Chats</h1>
      <SearchBar allUsers={allUsers} setUserData={setUserData} />
      {userData.length === 0 && !isUserFetching ? (
        <div className="flex justify-center items-center h-[87vh]">
          <p className="text-white font-bold text-lg">No User Found</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3 text-white h-[72vh] overflow-auto scroll-smooth no-scrollbar px-3 md:h-[87vh] md:pt-4 pb-2">
          {userData.map((user) => (
            <li
              key={user._id}
              className={`flex px-2 items-center cursor-pointer py-4 rounded-lg shadow-slate-300 shadow-sm ${
                user._id === selectedUserId
                  ? "bg-gradient-to-r from-custom-blue-light from-10% to-custom-blue-dark text-white"
                  : "bg-[#252331]"
              }`}
              onClick={() => {
                if (
                  localStorage.getItem("remoteUserId") &&
                  localStorage.getItem("remoteUserId") !== user._id
                ) {
                  setConnChangePopup(true);
                } else setSelectedUserId(user._id);
              }}
            >
              {
                <div className="flex items-center gap-4">
                  <img
                    src="https://satvision.in/wp-content/uploads/2019/06/user.jpg"
                    alt="avatar"
                    className={`rounded-full h-12 w-12 ${
                      onlineUsers.includes(user._id as string)
                        ? "border-[3px] border-green-700"
                        : "border-[3px] border-[#809290]"
                    }`}
                  />
                  <h1 className="text-lg font-semibold">{user.name}</h1>
                </div>
              }
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Contacts;
