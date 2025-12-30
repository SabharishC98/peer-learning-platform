"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Error caught by boundary:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Something went wrong!</h2>
                </div>

                <p className="text-gray-400 mb-6">
                    We encountered an unexpected error. Don't worry, your data is safe.
                </p>

                {error.message && (
                    <div className="bg-gray-900 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-300 font-mono">{error.message}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button
                        variant="primary"
                        onClick={reset}
                        className="flex-1"
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => (window.location.href = "/dashboard")}
                        className="flex-1"
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
