import { SetStateAction } from "react";
import searchIcon from "../assets/searchIcon.svg";
import { userTypes } from "../types/userTypes";
const Contacts = ({
  allUsers,
  setSelectedUserId,
}: {
  allUsers: userTypes[];
  setSelectedUserId: React.Dispatch<SetStateAction<string | null>>;
}) => {
  return (
    <>
      <div className="relative">
        <img src={searchIcon} alt="search" className="absolute right-2 top-1" />
        <input
          type="text"
          className="bg-[#817474] text-white rounded-full w-full px-4 py-2 text-lg font-semibold outline-none border-none"
        />
      </div>
      <ul className="pt-6 px-2 flex flex-col gap-6">
        {allUsers.map((user) => (
          <li
            key={user._id}
            className="flex items-center cursor-pointer"
            onClick={() => setSelectedUserId(user._id)}
          >
            {
              <div>
                <h1 className="text-lg font-semibold">{user._id}</h1>
                <p className="text-sm">{user.username}</p>
              </div>
            }
          </li>
        ))}
      </ul>
    </>
  );
};

export default Contacts;
