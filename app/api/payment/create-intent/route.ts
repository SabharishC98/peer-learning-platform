import { NextResponse } from "next/server";
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
        const { packageId } = body;

        if (!packageId) {
            return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
        }

        const selectedPackage = POINTS_PACKAGES.find((pkg) => pkg.id === packageId);

        if (!selectedPackage) {
            return NextResponse.json({ error: "Invalid package" }, { status: 400 });
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: selectedPackage.price,
            currency: "inr",
            metadata: {
                packageId: selectedPackage.id,
                points: selectedPackage.points.toString(),
                userEmail: session.user.email,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            packageDetails: selectedPackage,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
