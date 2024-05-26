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
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = stream;
          currentUserVideoRef.current.play();
          peer.current?.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (userVideoStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = userVideoStream;
                remoteVideoRef.current.play();
              }
            });
          });
        }
      });
    return () => {
      if (peer.current) {
        peer.current.disconnect();
      }
    };
  }, [peer, remoteVideoRef, currentUserVideoRef]);
  return (
    <div>
      <video className="w-72" playsInline ref={currentUserVideoRef} autoPlay />
      <video className="w-72" playsInline ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default VideoCall;
