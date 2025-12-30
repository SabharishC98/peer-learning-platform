import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, POINTS_PACKAGES } from "@/lib/stripe";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { paymentIntentId } = body;

        if (!paymentIntentId) {
            return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 });
        }

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
            return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get package details from metadata
        const packageId = paymentIntent.metadata.packageId;
        const points = parseInt(paymentIntent.metadata.points);

        // Add points to user in a transaction
        const result = await prisma.$transaction(async (tx: any) => {
            // Update user points
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: { points: { increment: points } },
            });

            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId: user.id,
                    type: "PURCHASE",
                    amount: points,
                    description: `Purchased ${points} points`,
                    paymentId: paymentIntentId,
                },
            });

            return updatedUser;
        });

        return NextResponse.json({
            success: true,
            newBalance: result.points,
            pointsAdded: points,
        });
    } catch (error) {
        console.error("Error confirming payment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
