export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    };

    return (
        <div
            className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}
        />
    );
}

export function LoadingPage() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400 mt-4">Loading...</p>
            </div>
        </div>
    );
}

export function LoadingSkeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-gray-700 rounded ${className}`}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <LoadingSkeleton className="h-6 w-3/4 mb-4" />
            <LoadingSkeleton className="h-4 w-full mb-2" />
            <LoadingSkeleton className="h-4 w-5/6 mb-2" />
            <LoadingSkeleton className="h-4 w-4/6" />
        </div>
    );
}
