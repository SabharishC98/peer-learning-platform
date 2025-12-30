"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ScanFace, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaceScanProps {
    onScanComplete: (hash: string) => void;
    className?: string;
}

export function FaceScan({ onScanComplete, className }: FaceScanProps) {
    const [scanning, setScanning] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(false);

    const startScan = () => {
        setScanning(true);
        setError(false);

        // Simulate scanning process
        setTimeout(() => {
            setScanning(false);
            setCompleted(true);
            // Generate a mock hash (in a real app, this would be a biometric hash)
            // For demo, we'll use a random string but consistent for the session if needed
            // To simulate uniqueness, we might need a way to seed it, but for now random is fine
            // as the backend handles the "check".
            const mockHash = "face_hash_" + Math.random().toString(36).substring(7);
            onScanComplete(mockHash);
        }, 3000);
    };

    return (
        <div className={cn("flex flex-col items-center justify-center p-6 border rounded-xl bg-black/5", className)}>
            <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                {scanning && (
                    <motion.div
                        className="absolute inset-0 border-4 border-blue-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                )}

                {completed ? (
                    <CheckCircle className="w-16 h-16 text-green-500" />
                ) : error ? (
                    <XCircle className="w-16 h-16 text-red-500" />
                ) : (
                    <ScanFace className={cn("w-16 h-16 text-gray-500", scanning && "text-blue-500")} />
                )}
            </div>

            <h3 className="text-lg font-semibold mb-2">
                {scanning ? "Scanning Face..." : completed ? "Identity Verified" : "Biometric Verification"}
            </h3>

            <p className="text-sm text-gray-500 text-center mb-4">
                {completed
                    ? "Your unique face ID has been generated."
                    : "We use facial analysis to ensure one account per person."}
            </p>

            {!completed && !scanning && (
                <button
                    onClick={startScan}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Start Face Scan
                </button>
            )}
        </div>
    );
}
