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
    peer.current?.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          console.log("stream", stream);
          if (currentUserVideoRef && currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = stream;
          }
          call.answer(stream);
          call.on("stream", (remoteVideoStream) => {
            if (remoteVideoRef && remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteVideoStream;
            }
          });
        });
    });
    return () => {
      if (peer.current?.call) {
        // peer.current?.call.
        peer.current.off("call");
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
