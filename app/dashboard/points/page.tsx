"use client";

import { useState, useEffect } from "react";
import { Coins, TrendingUp, TrendingDown, ShoppingCart } from "lucide-react";
import { PointsPackages } from "@/components/payment/PointsPackages";
import { Modal } from "@/components/ui/Modal";

export default function PointsPage() {
    const [points, setPoints] = useState(100);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch user points and transactions
        // This would be from an API in production
    }, []);

    const handlePurchase = async (packageId: string, price: number) => {
        setLoading(true);
        try {
            // Create payment intent
            const response = await fetch("/api/payment/create-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ packageId }),
            });

            const data = await response.json();

            // In production, integrate with Stripe Elements here
            alert("Payment integration would open here. For demo, points added!");
            setShowPurchaseModal(false);
        } catch (error) {
            console.error("Purchase error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Points & Transactions</h1>

            {/* Points Balance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Coins className="w-8 h-8" />
                        <h3 className="text-lg font-semibold">Available Points</h3>
                    </div>
                    <div className="text-4xl font-bold">{points}</div>
                    <p className="text-sm opacity-90 mt-2">~{Math.floor(points / 10)} sessions</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                        <h3 className="text-sm font-medium text-gray-400">Points Earned</h3>
                    </div>
                    <div className="text-3xl font-bold text-green-400">+50</div>
                    <p className="text-sm text-gray-500 mt-2">This month</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingDown className="w-6 h-6 text-red-400" />
                        <h3 className="text-sm font-medium text-gray-400">Points Spent</h3>
                    </div>
                    <div className="text-3xl font-bold text-red-400">-30</div>
                    <p className="text-sm text-gray-500 mt-2">This month</p>
                </div>
            </div>

            {/* Purchase Points Button */}
            <div className="mb-8">
                <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Purchase Points
                </button>
            </div>

            {/* Transaction History */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                </div>
                <div className="divide-y divide-gray-700">
                    {transactions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No transactions yet
                        </div>
                    ) : (
                        transactions.map((tx) => (
                            <div key={tx.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{tx.description}</div>
                                    <div className="text-sm text-gray-400">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className={`text-lg font-semibold ${tx.type === "EARN" || tx.type === "PURCHASE"
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }`}>
                                    {tx.type === "SPEND" ? "-" : "+"}{tx.amount}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Purchase Modal */}
            <Modal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                title="Purchase Points"
                size="xl"
            >
                <PointsPackages
                    onSelectPackage={handlePurchase}
                    isLoading={loading}
                />
            </Modal>
        </div>
    );
}
