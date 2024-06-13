import { SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import { PeerDataEnum, userTypes } from "../types/userTypes";
import ShowChat from "../components/ShowChat";
import axios from "axios";
import { messageTypes } from "../types/userTypes";
import Peer, { DataConnection } from "peerjs";
import socket from "../util/socket";
import SideBar from "../components/SideBar";
import RequestModal from "../components/RequestModal";
import Connection from "../components/Connection";
import ConnectionChangePopup from "../components/ConnectionChangePopup";
import { PeerData } from "../types/userTypes";
import Loader from "../components/Loader";

const Chat = ({
  isLoggedIn,
  setisLoggedIn,
}: {
  isLoggedIn: boolean;
  setisLoggedIn: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [remotePeerId, setRemotePeerId] = useState<string>("");
  const [allUsers, setallUsers] = useState<userTypes[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const peer = useRef<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>("");
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [requestedId, setRequestedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<messageTypes>>([]);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isAllowedToChat, setisAllowedToChat] = useState<boolean>(false);
  const [openVideoCall, setOpenVideoCall] = useState<boolean>(false);
  const [popupLabel, setpopupLabel] = useState<string>("");
  const [userData, setUserData] = useState<userTypes[]>([]);
  const [currUser, setCurrUser] = useState<userTypes | null>(null);
  const [connlostpopup, setconnlostpopup] = useState<boolean>(false);
  const [connChangePopup, setConnChangePopup] = useState<boolean>(false);
  const [isUserFetching, setIsUserFetching] = useState<boolean>(false);
  const [gettingPeerId, setGettingPeerId] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleReqAnswer = (id: string, from: string, popupLabel: string) => {
    setRemotePeerId(id);
    setisAllowedToChat(true);
    localStorage.setItem("remoteUserId", from);
    if (popupLabel === "Video") {
      call(id);
      call(remotePeerId);
    }
    setRequestedId(null);
  };

  const call = (id: string) => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const call = peer.current?.call(id, stream);
        if (call) {
          call.on("stream", (userVideoStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = userVideoStream;
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    socket.on("reqAccepted", (id: string, from: string, popupLabel: string) => {
      handleReqAnswer(id, from, popupLabel);
    });
    return () => {
      socket.off("reqAccepted");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    if (!isLoggedIn || token == null) {
      navigate("/login");
      return;
    }
    async function getallUsers() {
      setIsUserFetching(true);
      const Base_Url = import.meta.env.VITE_BACKEND_BASE_URL;
      const response = await axios.get(`${Base_Url}/user/getallUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setallUsers(response.data);
      setUserData(response.data);
      setIsUserFetching(false);
    }
    socket.emit("addUser", localStorage.getItem("userID"));

    socket.on(
      "showPopup",
      ({ fromId, popupLabel }: { fromId: string; popupLabel: string }) => {
        console.log("showPopup");
        setRequestedId(fromId);
        setpopupLabel(popupLabel);
      }
    );
    socket.on("browserRefresh", () => {
      if (localStorage.getItem("remoteUserId")) setconnlostpopup(true);
    });
    getallUsers();

    return () => {
      socket.off("showPopup");
      socket.off("reqDeclined");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newPeer = new Peer("", { debug: 2 });
    setGettingPeerId(true);
    newPeer.on("open", async (id) => {
      setPeerId(id);
      setGettingPeerId(false);
      if (localStorage.getItem("remoteUserId")) {
        socket.emit("browserRefresh", localStorage.getItem("remoteUserId"));
        localStorage.removeItem("remoteUserId");
      }
    });
    peer.current = newPeer;

    newPeer.on("connection", (conn) => {
      setRequestedId(null);
      setConnection(conn);

      conn.on("data", (data) => {
        const value = data as PeerData;
        let currtime = new Date().toLocaleTimeString().substring(0, 5);
        if (currtime[currtime.length - 1] === ":")
          currtime = currtime.substring(0, 4);
        if (value.dataType === PeerDataEnum.file) {
          if (!value.file || !value.fileName) return;
          setMessages((prev) => [
            ...prev,
            {
              self: false,
              message: "",
              time: currtime,
              from: "",
              isFile: true,
              fileObject: value,
            },
          ]);
        } else {
          const receivedData = data as PeerData;
          const value = receivedData.message;
          if (!value) return;
          const message = value.substring(24);
          const from = value.substring(0, 24);
          if (message !== "")
            setMessages((prev) => [
              ...prev,
              {
                self: false,
                message: message,
                time: currtime,
                from: from,
                isFile: false,
                fileObject: null,
              },
            ]);
        }
      });
    });

    return () => {
      newPeer.destroy();
    };
  }, []);
  useEffect(() => {
    if (peer && peerId && remotePeerId) {
      const conn = peer.current?.connect(remotePeerId);
      if (conn) setConnection(conn);
      if (conn)
        conn.on("data", (data) => {
          const value = data as PeerData;
          let currtime = new Date().toLocaleTimeString().substring(0, 5);
          console.log(currtime);
          if (currtime[currtime.length - 1] === ":")
            currtime = currtime.substring(0, 4);
          if (value.dataType === PeerDataEnum.file) {
            if (!value.file || !value.fileName) return;
            setMessages((prev) => [
              ...prev,
              {
                self: false,
                message: "",
                time: currtime,
                from: "",
                isFile: true,
                fileObject: value,
              },
            ]);
          } else {
            const receivedData = data as PeerData;
            const value = receivedData.message;
            if (!value) return;
            const message = value.substring(24);
            const from = value.substring(0, 24);
            if (message !== "")
              setMessages((prev) => [
                ...prev,
                {
                  self: false,
                  message: message,
                  time: currtime,
                  from: from,
                  isFile: false,
                  fileObject: null,
                },
              ]);
          }
        });
    }
  }, [peer, peerId, remotePeerId]);

  return (
    <div className="h-screen md:flex relative ">
      <div
        className={`bg-[#252331] py-4 px-6 w-full absolute bottom-0 md:w-[7%] md:left-0 md:h-full md:px-2 lg:w-[5%]`}
      >
        <SideBar setisLoggedIn={setisLoggedIn} />
      </div>
      {(isUserFetching || gettingPeerId) && <Loader />}
      <div
        className={`h-full flex flex-col  ${
          selectedUserId !== null ? "hidden" : ""
        } p-3 gap-6 md:block md:w-[29%]  md:ml-[7%] lg:ml-[5%]`}
      >
        <Contacts
          allUsers={allUsers}
          setSelectedUserId={setSelectedUserId}
          userData={userData}
          setUserData={setUserData}
          setConnChangePopup={setConnChangePopup}
          isUserFetching={isUserFetching}
          selectedUserId={selectedUserId}
        />
      </div>
      {requestedId !== null && (
        <RequestModal
          peerId={peerId}
          to={requestedId}
          setRequestedId={setRequestedId}
          setSelectedUserId={setSelectedUserId}
          setisAllowedToChat={setisAllowedToChat}
          popupLabel={popupLabel}
          requestedId={requestedId}
          isSender={false}
          selectedUserId={selectedUserId}
          setConnChangePopup={setConnChangePopup}
          setVisible={() => {}}
        />
      )}
      {connChangePopup && (
        <ConnectionChangePopup
          peerId={peerId}
          to={requestedId}
          setRequestedId={setRequestedId}
          setSelectedUserId={setSelectedUserId}
          setisAllowedToChat={setisAllowedToChat}
          popupLabel={popupLabel}
          requestedId={requestedId}
          isSender={false}
          setConnChangePopup={setConnChangePopup}
        />
      )}
      {connlostpopup && <Connection setconnlostpopup={setconnlostpopup} />}
      <div
        className={`h-full ${
          selectedUserId === null ? "hidden" : ""
        } md:w-[63%] md:block lg:w-[65%]`}
      >
        {selectedUserId !== null ? (
          <ShowChat
            messages={messages}
            setMessages={setMessages}
            connection={connection}
            selectedUserId={selectedUserId}
            openVideoCall={openVideoCall}
            currentUserVideoRef={currentUserVideoRef}
            remoteVideoRef={remoteVideoRef}
            peer={peer}
            setOpenVideoCall={setOpenVideoCall}
            isAllowedToChat={isAllowedToChat}
            requestedId={requestedId}
            currUser={currUser}
            setCurrUser={setCurrUser}
            setConnChangePopup={setConnChangePopup}
          />
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-2xl">Select a user to chat</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
