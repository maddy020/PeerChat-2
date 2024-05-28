import { SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import { userTypes } from "../types/userTypes";
import ShowChat from "../components/ShowChat";
import axios from "axios";
import RequestModal from "../components/RequestModal";
import { messageTypes } from "../types/userTypes";
import Peer, { DataConnection } from "peerjs";
import socket from "../util/socket";
import RequestChat from "../components/RequestChat";

const Chat = ({
  isLoggedIn,
  setisLoggedIn,
}: {
  isLoggedIn: boolean;
  setisLoggedIn: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [allUsers, setallUsers] = useState<userTypes[]>([]);
  const [selectedUserId, setselectedUserId] = useState<string | null>(null);
  const peer = useRef<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>("");
  const [remotePeerId, setRemotePeerId] = useState<string>("");
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [requestedId, setRequestedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<messageTypes>>([]);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isAllowedToChat, setisAllowedToChat] = useState<boolean>(false);
  const [openVideoCall, setOpenVideoCall] = useState<boolean>(false);
  const [popupLabel, setpopupLabel] = useState<string>("");
  const navigate = useNavigate();

  const call = (remotePeerId: string) => {
    console.log("call function called");
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (currentUserVideoRef && currentUserVideoRef.current) {
          console.log("stream", stream);
          currentUserVideoRef.current.srcObject = stream;
          currentUserVideoRef.current.play();
        }

        const call = peer.current?.call(remotePeerId, stream);
        if (call) {
          call.on("stream", (userVideoStream) => {
            console.log("remoteUserVideoStream", userVideoStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = userVideoStream;
              remoteVideoRef.current.play();
            }
          });
        }
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    if (!isLoggedIn || token == null) {
      navigate("/login");
      return;
    }
    async function getallUsers() {
      const Base_Url = import.meta.env.VITE_BACKEND_BASE_URL;
      const response = await axios.get(`${Base_Url}/user/getallUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setallUsers(response.data);
    }
    socket.emit("addUser", localStorage.getItem("userID"));

    socket.on(
      "showPopup",
      ({ fromId, popupLabel }: { fromId: string; popupLabel: string }) => {
        setRequestedId(fromId);
        setpopupLabel(popupLabel);
      }
    );

    socket.on("reqAccepted", (id: string) => {
      console.log("req accepted", id);
      if (remotePeerId.length !== 0) {
        call(id);
      } else {
        setRemotePeerId(id);
        setisAllowedToChat(true);
      }
      setRequestedId(null);
    });
    socket.on("reqDeclined", () => {
      console.log("req declined");
    });
    getallUsers();

    return () => {
      socket.off("showPopup");
      socket.off("reqAccepted");
      socket.off("reqDeclined");
    };
  }, []);

  useEffect(() => {
    const newPeer = new Peer("", { debug: 2 });
    newPeer.on("open", async (id) => {
      console.log("Peer ID:", id);
      setPeerId(id);
    });
    peer.current = newPeer;

    newPeer.on("connection", (conn) => {
      setRequestedId(null);
      setConnection(conn);

      conn.on("data", (data) => {
        setMessages((prev) => [
          ...prev,
          { self: false, message: data as string },
        ]);
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
          console.log("Received from another side:", data);
          setMessages((prev) => [
            ...prev,
            { self: false, message: data as string },
          ]);
        });
    }
  }, [peer, peerId, remotePeerId]);

  return (
    <div className="h-screen md:flex ">
      {requestedId !== null && (
        <RequestModal
          peerId={peerId}
          to={requestedId}
          setRequestedId={setRequestedId}
          setSelectedUserId={setselectedUserId}
          setisAllowedToChat={setisAllowedToChat}
          popupLabel={popupLabel}
        />
      )}
      {selectedUserId === null && (
        <div className="h-12 w-full absolute bottom-0 md:w-[9%] ">
          <button
            onClick={() => {
              localStorage.removeItem("authtoken");
              localStorage.removeItem("userID");
              setisLoggedIn(false);
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      )}
      <div
        className={`h-full ${
          selectedUserId !== null ? "hidden" : ""
        } px-4 pt-4 md:w-[30%]`}
      >
        <Contacts allUsers={allUsers} setSelectedUserId={setselectedUserId} />
      </div>
      <div
        className={`h-full ${
          selectedUserId === null ? "hidden" : ""
        } md:w-[61%]`}
      >
        {isAllowedToChat === false && selectedUserId !== null && (
          <RequestChat selectedUserId={selectedUserId} />
        )}
        {isAllowedToChat === true && (
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
          />
        )}
      </div>
      <div>
        <video ref={currentUserVideoRef} />
      </div>
      <div>
        <video ref={remoteVideoRef} />
      </div>
    </div>
  );
};

export default Chat;
