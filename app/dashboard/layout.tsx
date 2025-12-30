import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Fixed Navbar Container - stays at top */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Sidebar />
            </div>

            {/* Content Container - separate from navbar with padding */}
            <div className="flex-1 pt-28">
                <main className="h-full">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
