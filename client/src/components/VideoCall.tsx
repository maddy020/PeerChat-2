import Peer from "peerjs";
import { useEffect } from "react";

const VideoCall = ({
  currentUserVideoRef,
  remoteVideoRef,
  peer,
}: {
  currentUserVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  peer: React.RefObject<Peer | null>;
}) => {
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log("stream", stream);
        if (currentUserVideoRef && currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = stream;
          currentUserVideoRef.current.play();
        }
        peer.current?.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (remoteVideoStream) => {
            console.log("remotestream", remoteVideoRef);
            if (remoteVideoRef && remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteVideoStream;
              remoteVideoRef.current.play();
            }
          });
        });
      });
    return () => {
      if (peer.current) {
        peer.current.off("call");
      }
    };
  }, [peer, currentUserVideoRef, remoteVideoRef]);

  return (
    <div>
      <video className="w-72" ref={currentUserVideoRef} />
      <video className="w-72" ref={remoteVideoRef} />
    </div>
  );
};

export default VideoCall;
