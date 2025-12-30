# Environment Variables Template
# Copy this file to .env and fill in your actual values

# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth Configuration
# Generate a secure secret with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# Stripe Payment Integration
# Get your keys from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# PeerJS Configuration (for video conferencing)
# Use peerjs.com cloud service or run your own server
NEXT_PUBLIC_PEERJS_HOST="0.peerjs.com"
NEXT_PUBLIC_PEERJS_PORT="443"
NEXT_PUBLIC_PEERJS_PATH="/"
NEXT_PUBLIC_PEERJS_SECURE="true"

# Optional: Custom PeerJS Server
# NEXT_PUBLIC_PEERJS_HOST="localhost"
# NEXT_PUBLIC_PEERJS_PORT="9000"
# NEXT_PUBLIC_PEERJS_PATH="/myapp"
# NEXT_PUBLIC_PEERJS_SECURE="false"
