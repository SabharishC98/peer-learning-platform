# 🚀 Free Deployment Guide

Complete step-by-step guide to deploy your peer-learning platform for **100% FREE** using Vercel and Neon.

---

## Prerequisites

- [ ] GitHub account (for Vercel deployment)
- [ ] Stripe account with API keys
- [ ] 15 minutes of your time

---

## Step 1: Set Up Neon PostgreSQL Database (FREE)

### 1.1 Create Neon Account

1. Visit [https://neon.tech](https://neon.tech)
2. Click **Sign Up** (free, no credit card required)
3. Sign up with GitHub or email

### 1.2 Create Database

1. Click **Create Project**
2. Project name: `peer-learning-platform`
3. Region: Choose closest to your users
4. PostgreSQL version: **16** (latest)
5. Click **Create Project**

### 1.3 Get Connection String

1. In your Neon dashboard, click **Connection Details**
2. Copy the **Connection string** (starts with `postgresql://`)
3. Save it for later - you'll need this for `DATABASE_URL`

**Example format:**
```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## Step 2: Generate NextAuth Secret

Open PowerShell and run:

```powershell
# Generate a secure random secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Save the output** - you'll need this for `NEXTAUTH_SECRET`

---

## Step 3: Prepare Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

> [!TIP]
> Use **test keys** for initial deployment, switch to **live keys** when ready for production.

---

## Step 4: Deploy to Vercel (FREE)

### 4.1 Push to GitHub

If not already done:

```bash
cd C:\Users\sabha\.gemini\antigravity\scratch\peer-learning-platform

# Initialize git (if needed)
git init
git add .
git commit -m "Ready for deployment"

# Create GitHub repo and push
# Follow GitHub's instructions to create a new repository
git remote add origin https://github.com/YOUR_USERNAME/peer-learning-platform.git
git branch -M main
git push -u origin main
```

### 4.2 Deploy to Vercel

1. Visit [https://vercel.com](https://vercel.com)
2. Click **Sign Up** with GitHub (free, no credit card)
3. Click **Add New Project**
4. **Import** your `peer-learning-platform` repository
5. Click **Deploy** (don't configure anything yet)

**Wait for initial deployment to complete** (it will fail - that's expected!)

### 4.3 Configure Environment Variables

1. In Vercel, go to your project
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Generated secret from Step 2 | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | Production, Preview, Development |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Production, Preview, Development |
| `NEXT_PUBLIC_PEERJS_HOST` | `0.peerjs.com` | Production, Preview, Development |
| `NEXT_PUBLIC_PEERJS_PORT` | `443` | Production, Preview, Development |
| `NEXT_PUBLIC_PEERJS_PATH` | `/` | Production, Preview, Development |
| `NEXT_PUBLIC_PEERJS_SECURE` | `true` | Production, Preview, Development |

> [!IMPORTANT]
> For `NEXTAUTH_URL`, replace `your-app` with your actual Vercel deployment URL (found in the Deployments tab).

### 4.4 Redeploy

1. Go to **Deployments** tab
2. Click the **three dots** on the latest deployment
3. Click **Redeploy**
4. Check **Use existing Build Cache**
5. Click **Redeploy**

---

## Step 5: Initialize Database

### 5.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 5.2 Login to Vercel

```bash
vercel login
```

### 5.3 Link Project

```bash
cd C:\Users\sabha\.gemini\antigravity\scratch\peer-learning-platform
vercel link
```

Select your project when prompted.

### 5.4 Pull Environment Variables

```bash
vercel env pull .env.local
```

This downloads your production environment variables locally.

### 5.5 Run Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Neon database
npx prisma db push

# Seed database with initial data
npm run db:seed
```

**Expected output:**
```
✓ Database schema pushed successfully
✓ Seeded database with test users and skills
```

---

## Step 6: Verify Deployment

### 6.1 Check Health Endpoint

Visit: `https://your-app.vercel.app/api/health`

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T06:29:06.000Z"
}
```

### 6.2 Test Authentication

1. Visit your app: `https://your-app.vercel.app`
2. Click **Sign In**
3. Try logging in with seeded user:
   - Email: `john@example.com`
   - Password: `password123`

### 6.3 Test Core Features

- [ ] Dashboard loads
- [ ] Skills page works
- [ ] Session booking works
- [ ] Points display correctly

---

## Step 7: Configure Stripe Webhooks (Optional)

For production payments, set up webhooks:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to Vercel environment variables:
   - Name: `STRIPE_WEBHOOK_SECRET`
   - Value: Your signing secret

---

## Troubleshooting

### Build Fails on Vercel

**Check build logs** in Vercel dashboard:
- Look for TypeScript errors
- Check for missing dependencies
- Verify environment variables are set

### Database Connection Error

**Verify connection string:**
```bash
npx prisma db pull
```

If this fails, check:
- Connection string format is correct
- Neon database is active (not paused)
- SSL mode is included: `?sslmode=require`

### NextAuth Error

**Ensure these are set:**
- `NEXTAUTH_SECRET` (at least 32 characters)
- `NEXTAUTH_URL` (your Vercel URL)

**Regenerate secret if needed:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Video Not Working

**Check browser console** for errors:
- Allow camera/microphone permissions
- Verify PeerJS environment variables
- Test on HTTPS only (required for WebRTC)

---

## Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| **Vercel** | 100GB bandwidth/month | $0 |
| **Neon** | 0.5GB storage, always-on | $0 |
| **PeerJS Cloud** | Unlimited connections | $0 |
| **Stripe** | Pay per transaction only | $0 monthly |

**Total: $0/month** 🎉

---

## Next Steps

### Custom Domain (Optional)

1. In Vercel, go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

### Monitoring

- **Vercel Analytics**: Automatically enabled (free)
- **Uptime Monitoring**: Use [UptimeRobot](https://uptimerobot.com) (free)
- **Error Tracking**: Consider [Sentry](https://sentry.io) (free tier available)

### Scaling

When you outgrow free tiers:
- **Vercel Pro**: $20/month (1TB bandwidth)
- **Neon Scale**: $19/month (10GB storage)
- **Self-hosted PeerJS**: Deploy on Railway/Render

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build locally
npm run build

# Deploy to Vercel
vercel --prod

# Database commands
npx prisma studio          # Open database GUI
npx prisma db push         # Push schema changes
npx prisma migrate deploy  # Run migrations
npm run db:seed            # Seed database

# Pull environment variables
vercel env pull .env.local
```

---

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**🎉 Congratulations!** Your peer-learning platform is now deployed and accessible worldwide for free!
