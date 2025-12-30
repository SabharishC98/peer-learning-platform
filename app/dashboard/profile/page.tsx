"use client";

import { useState, useEffect } from "react";
import { User, Mail, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        bio: "",
        timezone: "UTC",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setProfile({
                name: session.user.name || "",
                email: session.user.email || "",
                bio: "",
                timezone: "UTC",
            });
        }
    }, [session]);

    const handleSave = async () => {
        setLoading(true);
        try {
            // API call to update profile
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-400">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="max-w-2xl">
                {/* Profile Picture */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                            {profile.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-1">{profile.name || "User"}</h2>
                            <p className="text-gray-400">{profile.email}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Profile Information</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-60"
                                disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Bio
                            </label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                placeholder="Tell others about yourself..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Timezone
                            </label>
                            <select
                                value={profile.timezone}
                                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern Time</option>
                                <option value="America/Los_Angeles">Pacific Time</option>
                                <option value="Europe/London">London</option>
                                <option value="Asia/Kolkata">India</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            isLoading={loading}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
                        <Award className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-400">Skills Verified</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-400">Sessions Taught</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-gray-400">Sessions Attended</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
