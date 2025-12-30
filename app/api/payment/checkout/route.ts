import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-11-17.clover",
});

const PACKAGES = {
    starter: { points: 50, price: 499 },
    popular: { points: 150, price: 1299 },
    pro: { points: 300, price: 2399 },
    ultimate: { points: 500, price: 3499 },
};

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { packageId } = await request.json();

        if (!packageId || !(packageId in PACKAGES)) {
            return NextResponse.json(
                { error: "Invalid package" },
                { status: 400 }
            );
        }

        const pkg = PACKAGES[packageId as keyof typeof PACKAGES];

        // Create Stripe Checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `${pkg.points} Learning Points`,
                            description: `Purchase ${pkg.points} points for peer learning sessions`,
                        },
                        unit_amount: pkg.price,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXTAUTH_URL}/dashboard/points?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/points?canceled=true`,
            metadata: {
                userId: session.user.email,
                packageId,
                points: pkg.points.toString(),
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
