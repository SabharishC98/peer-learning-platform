"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaceScan } from "@/components/auth/FaceScan";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [faceHash, setFaceHash] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleScanComplete = (hash: string) => {
        setFaceHash(hash);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!faceHash) {
            setError("Please complete the face verification.");
            setLoading(false);
            return;
        }

        try {
            const result = await signIn("credentials", {
                email,
                faceHash,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid credentials or face verification failed.");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700"
            >
                <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    Verify your identity to continue
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="pt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
                            Identity Verification
                        </label>
                        <FaceScan onScanComplete={handleScanComplete} className="bg-gray-700/50 border-gray-600" />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!faceHash || loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Sign In"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-400 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
