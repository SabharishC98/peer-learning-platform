import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Zap } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        PeerLearn
                    </div>
                    <div className="flex gap-4">
                        <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-blue-400 transition-colors">
                            Log In
                        </Link>
                        <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                        Master Skills. <br />
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Teach & Earn.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        A decentralized learning platform where knowledge is currency.
                        Verify your skills, teach others, and earn points to learn from the best.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/signup" className="group px-8 py-4 bg-blue-600 rounded-full font-semibold text-lg hover:bg-blue-500 transition-all flex items-center gap-2">
                            Start Learning Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/login" className="px-8 py-4 border border-white/20 rounded-full font-semibold text-lg hover:bg-white/5 transition-all">
                            I want to Teach
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="max-w-7xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors">
                        <ShieldCheck className="w-12 h-12 text-blue-400 mb-6" />
                        <h3 className="text-xl font-bold mb-4">Verified Skills</h3>
                        <p className="text-gray-400">
                            Pass coding tests and MCQ assessments to become a verified teacher.
                            Our AI checks for plagiarism to ensure quality.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                        <Users className="w-12 h-12 text-purple-400 mb-6" />
                        <h3 className="text-xl font-bold mb-4">One-on-One Video</h3>
                        <p className="text-gray-400">
                            Connect directly via high-quality video calls.
                            Learn at your own pace with personalized attention.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-colors">
                        <Zap className="w-12 h-12 text-pink-400 mb-6" />
                        <h3 className="text-xl font-bold mb-4">AI-Powered Matching</h3>
                        <p className="text-gray-400">
                            Find the perfect teacher instantly. Our smart algorithm matches you
                            based on learning style and compatibility.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
