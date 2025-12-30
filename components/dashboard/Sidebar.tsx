"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Search,
    Calendar,
    BookOpen,
    Coins,
    User,
    Bell,
    Video,
    LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/search", label: "Teachers", icon: Search },
    { href: "/dashboard/sessions", label: "Sessions", icon: Video },
    { href: "/dashboard/schedule", label: "Schedule", icon: Calendar },
    { href: "/dashboard/skills", label: "Skills", icon: BookOpen },
    { href: "/dashboard/points", label: "Points", icon: Coins },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/notifications", label: "Alerts", icon: Bell },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 border-b border-gray-700 z-50 shadow-lg mb-4">
            <div className="px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">PL</span>
                        </div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hidden sm:block">
                            PeerLearn
                        </h1>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4 overflow-x-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all text-sm whitespace-nowrap ${isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}

                        {/* Sign Out */}
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-1.5 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-md transition-all text-sm ml-4 whitespace-nowrap"
                        >
                            <LogOut className="w-4 h-4 flex-shrink-0" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
