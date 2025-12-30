"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [teacherId, setTeacherId] = useState("");
    const [skillName, setSkillName] = useState("");
    const [minDate, setMinDate] = useState("");

    // Set minimum date on client side to avoid hydration mismatch
    useEffect(() => {
        setMinDate(new Date().toISOString().split('T')[0]);
    }, []);

    const handleSchedule = async () => {
        if (!selectedDate || !selectedTime || !teacherId || !skillName) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const scheduledTime = new Date(`${selectedDate}T${selectedTime}`);

            const response = await fetch("/api/session/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teacherId,
                    skillName,
                    scheduledTime: scheduledTime.toISOString(),
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Session scheduled successfully!");
                // Reset form
                setSelectedDate("");
                setSelectedTime("");
                setTeacherId("");
                setSkillName("");
            } else {
                alert(data.error || "Failed to schedule session");
            }
        } catch (error) {
            console.error("Error scheduling session:", error);
            alert("Error scheduling session");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Schedule a Session</h1>

            <div className="max-w-2xl">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-6">Session Details</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Skill Name
                            </label>
                            <input
                                type="text"
                                value={skillName}
                                onChange={(e) => setSkillName(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., JavaScript, Python, React"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Teacher ID
                            </label>
                            <input
                                type="text"
                                value={teacherId}
                                onChange={(e) => setTeacherId(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Teacher's user ID"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Find teachers in the "Find Teachers" page
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                <CalendarIcon className="w-4 h-4 inline mr-2" />
                                Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={minDate}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                <Clock className="w-4 h-4 inline mr-2" />
                                Time
                            </label>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <p className="text-sm text-blue-400">
                                <strong>Cost:</strong> 10 points per session
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Points will be deducted when you schedule the session
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            variant="primary"
                            onClick={handleSchedule}
                            className="w-full"
                        >
                            Schedule Session
                        </Button>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h4 className="font-semibold mb-3">Quick Tips</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>• Sessions cost 10 points each</li>
                        <li>• You can earn points by teaching others</li>
                        <li>• Purchase more points in the Points page</li>
                        <li>• Sessions can be scheduled up to 30 days in advance</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
