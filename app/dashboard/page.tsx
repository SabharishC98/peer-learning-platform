import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { skills: true },
    });

    if (!user) return null;

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Hello, {user.name}</h1>
                <p className="text-gray-400">Welcome back to your learning dashboard.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Available Points</h3>
                    <div className="text-4xl font-bold text-yellow-400">{user.points}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Verified Skills</h3>
                    <div className="text-4xl font-bold text-blue-400">{user.skills.length}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Sessions Completed</h3>
                    <div className="text-4xl font-bold text-purple-400">0</div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Your Verified Skills</h2>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {user.skills.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50 text-gray-400 text-sm">
                            <tr>
                                <th className="p-4">Skill Name</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date Verified</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {user.skills.map((skill: any) => (
                                <tr key={skill.id}>
                                    <td className="p-4 font-medium">{skill.name}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                            Verified
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400">Just now</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-gray-400">
                        You haven't verified any skills yet.{" "}
                        <a href="/dashboard/skills" className="text-blue-400 hover:underline">
                            Take a test
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
