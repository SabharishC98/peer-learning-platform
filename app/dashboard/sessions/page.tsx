"use client";

import { useState, useEffect } from "react";
import { SessionCard } from "@/components/dashboard/SessionCard";
import { Tabs } from "lucide-react";

export default function SessionsPage() {
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch sessions from API
        // This would be implemented in production
        setLoading(false);
    }, [activeTab]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">My Sessions</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === "upcoming"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    Upcoming Sessions
                </button>
                <button
                    onClick={() => setActiveTab("past")}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === "past"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    Past Sessions
                </button>
            </div>

            {/* Sessions List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        Loading sessions...
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No {activeTab} sessions found
                    </div>
                ) : (
                    sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            userRole="student" // This would be determined from the session data
                        />
                    ))
                )}
            </div>
        </div>
    );
}
