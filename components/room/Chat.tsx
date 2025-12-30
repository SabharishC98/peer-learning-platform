"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/Button";

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
}

interface ChatProps {
    sessionId: string;
    currentUserId: string;
    currentUserName: string;
}

export function Chat({ sessionId, currentUserId, currentUserName }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: Date.now().toString(),
            senderId: currentUserId,
            senderName: currentUserName,
            content: newMessage,
            timestamp: new Date(),
        };

        // Add message locally
        setMessages((prev) => [...prev, message]);

        // Send to server
        try {
            await fetch("/api/session/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    content: newMessage,
                }),
            });
        } catch (error) {
            console.error("Failed to send message:", error);
        }

        setNewMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold text-white">Session Chat</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwn = msg.senderId === currentUserId;

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${isOwn
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-800 text-gray-200"
                                        }`}
                                >
                                    {!isOwn && (
                                        <div className="text-xs text-gray-400 mb-1">
                                            {msg.senderName}
                                        </div>
                                    )}
                                    <div className="text-sm">{msg.content}</div>
                                    <div
                                        className={`text-xs mt-1 ${isOwn ? "text-blue-200" : "text-gray-500"
                                            }`}
                                    >
                                        {msg.timestamp.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                        variant="primary"
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
