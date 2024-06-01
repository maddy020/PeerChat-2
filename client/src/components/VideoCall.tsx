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
        console.log("stream inside the useEffect call:", stream);
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = stream;
        }
        peer.current?.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userVideoStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = userVideoStream;
            }
          });
        });
      });
    return () => {
      if (peer) {
        peer.current?.disconnect();
      }
    };
  }, [peer, currentUserVideoRef, remoteVideoRef]);

  return (
    <div>
      <video className="w-72" ref={currentUserVideoRef} autoPlay />
      <video className="w-72" ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default VideoCall;
