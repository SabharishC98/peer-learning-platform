import Stripe from "stripe";

// Initialize Stripe with your secret key
// In production, use environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2025-11-17.clover",
});

// Points packages available for purchase
export const POINTS_PACKAGES = [
    { id: "basic", points: 50, price: 499, name: "Basic", popular: false },
    { id: "standard", points: 150, price: 1299, name: "Standard", popular: true },
    { id: "premium", points: 300, price: 2499, name: "Premium", popular: false },
    { id: "ultimate", points: 500, price: 3999, name: "Ultimate", popular: false },
];
