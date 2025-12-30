"use client";

import { Check, Zap } from "lucide-react";
import { Button } from "../ui/Button";

const PACKAGES = [
    {
        id: "starter",
        name: "Starter",
        points: 50,
        price: 499,
        popular: false,
    },
    {
        id: "popular",
        name: "Popular",
        points: 150,
        price: 1299,
        popular: true,
        savings: "Save 13%",
    },
    {
        id: "pro",
        name: "Pro",
        points: 300,
        price: 2399,
        popular: false,
        savings: "Save 20%",
    },
    {
        id: "ultimate",
        name: "Ultimate",
        points: 500,
        price: 3499,
        popular: false,
        savings: "Save 30%",
    },
];

interface PointsPackagesProps {
    onSelectPackage: (packageId: string, price: number) => void;
    isLoading?: boolean;
}

export function PointsPackages({ onSelectPackage, isLoading }: PointsPackagesProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGES.map((pkg) => (
                <div
                    key={pkg.id}
                    className={`relative bg-gray-800 rounded-xl p-6 border ${pkg.popular
                            ? "border-blue-500 shadow-lg shadow-blue-500/20"
                            : "border-gray-700"
                        }`}
                >
                    {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                POPULAR
                            </span>
                        </div>
                    )}

                    <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold text-blue-400">{pkg.points}</span>
                            <span className="text-gray-400">points</span>
                        </div>
                        {pkg.savings && (
                            <div className="mt-2 text-green-400 text-sm font-medium">
                                {pkg.savings}
                            </div>
                        )}
                    </div>

                    <div className="text-center mb-6">
                        <div className="text-3xl font-bold">₹{pkg.price}</div>
                        <div className="text-sm text-gray-400">one-time payment</div>
                    </div>

                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>{pkg.points} learning points</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>~{Math.floor(pkg.points / 10)} sessions</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Never expires</span>
                        </li>
                    </ul>

                    <Button
                        variant={pkg.popular ? "primary" : "secondary"}
                        className="w-full"
                        onClick={() => onSelectPackage(pkg.id, pkg.price)}
                        isLoading={isLoading}
                    >
                        <Zap className="w-4 h-4 mr-2" />
                        Purchase
                    </Button>
                </div>
            ))}
        </div>
    );
}
