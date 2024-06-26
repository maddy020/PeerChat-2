import { SetStateAction, useRef } from "react";
// import searchIcon from "../../public/assets/searchIcon.svg";
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
      <button className="absolute right-2 top-1">
        <svg
          width="32"
          height="35"
          viewBox="0 0 32 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_78_8880)">
            <path
              d="M26.9658 27L17.7923 17.8277C17.0599 18.4517 16.2175 18.9346 15.2653 19.2764C14.3131 19.6181 13.356 19.789 12.3941 19.789C10.0482 19.789 8.06275 18.9771 6.43765 17.3531C4.81255 15.7282 4 13.7435 4 11.3989C4 9.05432 4.81157 7.0686 6.43472 5.44175C8.05884 3.81391 10.0433 3 12.3882 3C14.7341 3 16.7205 3.81245 18.3476 5.43735C19.9746 7.06225 20.7881 9.04797 20.7881 11.3945C20.7881 12.412 20.6079 13.3968 20.2476 14.3489C19.8862 15.301 19.4126 16.1154 18.8266 16.7921L28 25.963L26.9658 27ZM12.3941 18.3228C14.3375 18.3228 15.9788 17.6539 17.3177 16.3161C18.6557 14.9783 19.3247 13.3373 19.3247 11.393C19.3247 9.4498 18.6557 7.80928 17.3177 6.47147C15.9797 5.13366 14.339 4.46475 12.3955 4.46475C10.4521 4.46475 8.81084 5.13366 7.47189 6.47147C6.13392 7.80928 5.46493 9.4498 5.46493 11.393C5.46493 13.3363 6.13392 14.9768 7.47189 16.3146C8.80986 17.6524 10.4506 18.3228 12.3941 18.3228Z"
              fill="#C5C0CF"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_78_8880"
              x="-3"
              y="0"
              width="38"
              height="38"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_78_8880"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_78_8880"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </button>
      <input
        type="text"
        placeholder="Search"
        className="rounded-lg w-full px-4 py-2 text-lg font-semibold text-white outline-none border-none bg-[#252331] shadow-sm shadow-slate-300"
        ref={inputRef}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
