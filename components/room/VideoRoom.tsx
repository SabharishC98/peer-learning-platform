"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MessageSquare, Clock } from "lucide-react";
import { Button } from "../ui/Button";
import { Chat } from "./Chat";

interface VideoRoomProps {
    sessionId: string;
    userId: string;
    userName: string;
    isTeacher: boolean;
}

export function VideoRoom({ sessionId, userId, userName, isTeacher }: VideoRoomProps) {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [peerId, setPeerId] = useState<string>("");
    const [remotePeerId, setRemotePeerId] = useState<string>("");
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const sessionStartTime = useRef<number>(Date.now());

    // Initialize peer connection
    useEffect(() => {
        const newPeer = new Peer(undefined, {
            host: "0.peerjs.com",
            port: 443,
            path: "/",
            secure: true,
        });

        newPeer.on("open", (id) => {
            setPeerId(id);
            console.log("My peer ID:", id);
        });

        newPeer.on("call", (call) => {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    localStreamRef.current = stream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }

                    call.answer(stream);

                    call.on("stream", (remoteStream) => {
                        remoteStreamRef.current = remoteStream;
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                        setIsConnected(true);
                    });
                })
                .catch((err) => console.error("Failed to get media:", err));
        });

        setPeer(newPeer);

        return () => {
            newPeer.destroy();
        };
    }, []);

    // Session timer
    useEffect(() => {
        const interval = setInterval(() => {
            setSessionDuration(Math.floor((Date.now() - sessionStartTime.current) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Call peer
    const callPeer = (remotePeerIdInput: string) => {
        if (!peer) return;

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                const call = peer.call(remotePeerIdInput, stream);

                call.on("stream", (remoteStream) => {
                    remoteStreamRef.current = remoteStream;
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                    setIsConnected(true);
                });
            })
            .catch((err) => console.error("Failed to get media:", err));
    };

    // Toggle audio
    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    };

    // Toggle video
    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    };

    // Screen sharing
    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            // Stop screen sharing
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach((track) => track.stop());
                screenStreamRef.current = null;
            }
            setIsScreenSharing(false);
        } else {
            // Start screen sharing
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                });
                screenStreamRef.current = screenStream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screenStream;
                }
                setIsScreenSharing(true);

                // Stop screen sharing when user clicks "Stop sharing" in browser
                screenStream.getVideoTracks()[0].onended = () => {
                    setIsScreenSharing(false);
                    if (localStreamRef.current && localVideoRef.current) {
                        localVideoRef.current.srcObject = localStreamRef.current;
                    }
                };
            } catch (err) {
                console.error("Failed to share screen:", err);
            }
        }
    };

    // End session
    const endSession = async () => {
        // Stop all streams
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
        screenStreamRef.current?.getTracks().forEach((track) => track.stop());

        // End session on server
        try {
            await fetch("/api/session/end", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
            });
        } catch (error) {
            console.error("Failed to end session:", error);
        }

        // Redirect to dashboard
        window.location.href = "/dashboard/sessions";
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="h-screen bg-black flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-mono">{formatDuration(sessionDuration)}</span>
                        </div>
                        {isConnected && (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                Connected
                            </span>
                        )}
                    </div>
                    <div className="text-gray-400 text-sm">
                        Session ID: {sessionId.slice(0, 8)}...
                    </div>
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 flex gap-4 p-4">
                {/* Main Video */}
                <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    {!isConnected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                            <div className="text-center">
                                <div className="text-gray-400 mb-4">Waiting for other participant...</div>
                                {peerId && (
                                    <div className="text-sm text-gray-500">
                                        Your Peer ID: <span className="font-mono">{peerId}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-80 flex flex-col gap-4">
                    {/* Local Video */}
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                            You
                        </div>
                    </div>

                    {/* Chat */}
                    {showChat && (
                        <div className="flex-1 min-h-0">
                            <Chat sessionId={sessionId} currentUserId={userId} currentUserName={userName} />
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900 border-t border-gray-800 p-4">
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant={isAudioEnabled ? "secondary" : "danger"}
                        onClick={toggleAudio}
                        className="rounded-full w-12 h-12 p-0"
                    >
                        {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant={isVideoEnabled ? "secondary" : "danger"}
                        onClick={toggleVideo}
                        className="rounded-full w-12 h-12 p-0"
                    >
                        {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant={isScreenSharing ? "primary" : "secondary"}
                        onClick={toggleScreenShare}
                        className="rounded-full w-12 h-12 p-0"
                    >
                        <Monitor className="w-5 h-5" />
                    </Button>

                    <Button
                        variant={showChat ? "primary" : "secondary"}
                        onClick={() => setShowChat(!showChat)}
                        className="rounded-full w-12 h-12 p-0"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="danger"
                        onClick={endSession}
                        className="rounded-full w-12 h-12 p-0"
                    >
                        <PhoneOff className="w-5 h-5" />
                    </Button>
                </div>

                {/* Connection Helper */}
                {!isConnected && peerId && (
                    <div className="mt-4 text-center">
                        <div className="text-sm text-gray-400 mb-2">Or connect manually:</div>
                        <div className="flex gap-2 justify-center">
                            <input
                                type="text"
                                placeholder="Enter peer ID"
                                value={remotePeerId}
                                onChange={(e) => setRemotePeerId(e.target.value)}
                                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
                            />
                            <Button size="sm" onClick={() => callPeer(remotePeerId)}>
                                Connect
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
