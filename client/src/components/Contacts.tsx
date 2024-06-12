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
      console.log(onlineUsersArr);
      setOnlineUsers(onlineUsersArr);
    });
  });
  return (
    <>
      <SearchBar allUsers={allUsers} setUserData={setUserData} />
      {userData.length === 0 && !isUserFetching ? (
        <div>No User Found</div>
      ) : (
        <ul className="flex flex-col gap-6 h-[80vh] overflow-auto scroll-smooth scrollbar-thin px-3 md:h-[92vh] md:pt-4">
          {userData.map((user) => (
            <li
              key={user._id}
              className={`flex px-2 items-center cursor-pointer py-2 rounded-lg  ${
                user._id === selectedUserId ? "bg-primary-600 text-white" : ""
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
                        ? "border-4 border-green-500"
                        : "border-4 border-primary-600"
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
