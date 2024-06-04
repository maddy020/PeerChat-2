import { SetStateAction, useRef } from "react";
import searchIcon from "../assets/searchIcon.svg";
import { userTypes } from "../types/userTypes";

const SearchBar = ({
  allUsers,
  setUserData,
}: {
  allUsers: userTypes[];
  setUserData: React.Dispatch<SetStateAction<userTypes[]>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = () => {
    try {
      const value: string = inputRef.current?.value as string;
      if (value?.length === 0) {
        setUserData(allUsers);
      } else {
        const filteredUsers = allUsers.filter((user) => {
          const match = user.name.toLowerCase().includes(value?.toLowerCase());
          return match;
        });
        setUserData(filteredUsers);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="relative">
      <img src={searchIcon} alt="search" className="absolute right-2 top-1" />
      <input
        type="text"
        placeholder="Search"
        className="bg-[#817474] text-white rounded-full w-full px-4 py-2 text-lg font-semibold outline-none border-none"
        ref={inputRef}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
