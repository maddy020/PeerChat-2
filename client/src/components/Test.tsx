import { useEffect } from "react";
import socket from "../util/socket";
import Peer from "peerjs";
const Test = ({
  setRemotePeerId,
  setisAllowedToChat,
  setRequestedId,
  currentUserVideoRef,
  remoteVideoRef,
  peer,
}: {
  setRemotePeerId: React.Dispatch<React.SetStateAction<string>>;
  setisAllowedToChat: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestedId: React.Dispatch<React.SetStateAction<string | null>>;
  currentUserVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  peer: React.RefObject<Peer | null>;
}) => {
  const handleReqAnswer = (id: string, popupLabel: string) => {
    console.log("Inside the handleReqAnswer");
    setRemotePeerId(id);
    setisAllowedToChat(true);
    console.log("popuplabel", popupLabel);
    if (popupLabel === "Video") call(id);
    setRequestedId(null);
  };

  const call = (remotePeerId: string) => {
    console.log("call function received");

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
    socket.on("reqAccepted", (id: string, popupLabel: string) => {
      console.log("popuplabel just inside the socket", popupLabel);
      handleReqAnswer(id, popupLabel);
    });
    return () => {
      socket.off("reqAccepted");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>test</div>;
};

export default Test;
