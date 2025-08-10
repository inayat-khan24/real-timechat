import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";

const socket = io("https://real-timechat-l7bv.onrender.com");

const VideoCall = ({ username, selectedUserVideo }) => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerRef = useRef(null);
  const localStream = useRef(null);
  const timerRef = useRef(null);

  const [callStarted, setCallStarted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    // Offer handler
    const handleOffer = async ({ sdp, from }) => {
      if (peerRef.current) peerRef.current.close();
      peerRef.current = createPeer(false, from);

      await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));

      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      socket.emit("answer", { sdp: answer, to: from });
      setCallStarted(true);
      startTimer();
    };

    // Answer handler
    const handleAnswer = async ({ sdp }) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    };

    // ICE candidate handler
    const handleIceCandidate = ({ candidate }) => {
      if (peerRef.current && candidate) {
        peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      endCall();
    };
  }, []);

  const createPeer = (initiator, to = null) => {
    if (!localStream.current) {
      console.warn("Local stream not available yet!");
      return null;
    }

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStream.current.getTracks().forEach((track) => {
      peer.addTrack(track, localStream.current);
    });

    peer.ontrack = (event) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = event.streams[0];
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to,
        });
      }
    };

    return peer;
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setCallDuration(0);
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;

      // Close any existing peer connection before creating a new one
      if (peerRef.current) {
        peerRef.current.close();
      }

      peerRef.current = createPeer(true, selectedUserVideo);

      if (!peerRef.current) return;

      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);

      socket.emit("offer", { sdp: offer, to: selectedUserVideo });
      setCallStarted(true);
      startTimer();
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    if (localVideo.current) localVideo.current.srcObject = null;
    if (remoteVideo.current) remoteVideo.current.srcObject = null;

    setCallStarted(false);
    stopTimer();
  };

  const handleCallToggle = () => {
    if (callStarted) {
      endCall();
    } else {
      startCall();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">📞 Video Call Interface</h2>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 w-full max-w-5xl">
        <div className="w-full lg:w-1/2 relative border-4 border-blue-500 rounded-lg overflow-hidden">
          <video
            ref={localVideo}
            autoPlay
            muted
            className="w-full h-[200px] sm:h-[300px] object-cover"
          />
          <p className="absolute bottom-2 left-2 text-sm bg-black/50 px-2 py-1 rounded">You</p>
        </div>

        <div className="w-full lg:w-1/2 relative border-4 border-green-500 rounded-lg overflow-hidden">
          <video
            ref={remoteVideo}
            autoPlay
            className="w-full h-[200px] sm:h-[300px] object-cover"
          />
          <p className="absolute bottom-2 left-2 text-sm bg-black/50 px-2 py-1 rounded">{selectedUserVideo}</p>
        </div>
      </div>

      {callStarted && (
        <div className="mt-6 text-lg font-semibold text-green-400 animate-pulse">
          ⏱ Call Duration: {formatTime(callDuration)}
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={handleCallToggle}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300 ${
            callStarted ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {callStarted ? (
            <>
              <BsCameraVideoOff size={20} />
              End Call
            </>
          ) : (
            <>
              <BsCameraVideo size={20} />
              Start Call
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
