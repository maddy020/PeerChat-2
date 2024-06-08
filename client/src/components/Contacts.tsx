import { SetStateAction } from "react";
import SearchBar from "./SearchBar";
import { userTypes } from "../types/userTypes";
const Contacts = ({
  allUsers,
  setSelectedUserId,
  userData,
  setUserData,
  setConnChangePopup,
}: {
  allUsers: userTypes[];
  setSelectedUserId: React.Dispatch<SetStateAction<string | null>>;
  userData: userTypes[];
  setUserData: React.Dispatch<SetStateAction<userTypes[]>>;
  setConnChangePopup: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <SearchBar allUsers={allUsers} setUserData={setUserData} />
      {userData.length === 0 ? (
        <div>No User Found</div>
      ) : (
        <ul className="flex flex-col gap-6 h-[96vh] overflow-auto scroll-smooth">
          {userData.map((user) => (
            <li
              key={user._id}
              className="flex px-2 items-center cursor-pointer"
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
                    className="rounded-full h-12 w-12"
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
