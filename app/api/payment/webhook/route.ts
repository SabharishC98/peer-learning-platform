import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get("stripe-signature");

        if (!signature) {
            return NextResponse.json(
                { error: "Missing signature" },
                { status: 400 }
            );
        }

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error("Webhook signature verification failed:", err.message);
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

        // Handle the checkout.session.completed event
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            const userId = session.metadata?.userId;
            const packageId = session.metadata?.packageId;
            const points = parseInt(session.metadata?.points || "0");

            if (!userId || !points) {
                console.error("Missing metadata in checkout session");
                return NextResponse.json({ received: true });
            }

            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email: userId },
            });

            if (!user) {
                console.error("User not found:", userId);
                return NextResponse.json({ received: true });
            }

            // Add points to user account
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    points: {
                        increment: points,
                    },
                },
            });

            // Create transaction record
            await prisma.pointTransaction.create({
                data: {
                    userId: user.id,
                    type: "PURCHASE",
                    amount: points,
                    description: `Purchased ${points} points (${packageId} package)`,
                },
            });

            console.log(`Added ${points} points to user ${user.email}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}
