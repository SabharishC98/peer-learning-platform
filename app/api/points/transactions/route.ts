import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                transactions: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 50, // Limit to last 50 transactions
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userWithTransactions = user as any;

        return NextResponse.json({
            success: true,
            points: user.points,
            transactions: (userWithTransactions.transactions || []).map((t: any) => ({
                id: t.id,
                type: t.type,
                amount: t.amount,
                description: t.description,
                createdAt: t.createdAt,
            })),
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
