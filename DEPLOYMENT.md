# 🚀 Production Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Database configured (SQLite for dev, PostgreSQL recommended for production)
- [ ] Stripe account with API keys
- [ ] Domain name (optional but recommended)
- [ ] Hosting platform account (Vercel, Netlify, or similar)

---

## Step 1: Environment Configuration

### 1.1 Generate NextAuth Secret

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 1.2 Create Production .env File

Create `.env.production` with the following variables:

```env
# Database - Use PostgreSQL for production
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="[your-generated-secret-from-step-1.1]"
NEXTAUTH_URL="https://yourdomain.com"

# Stripe (Production Keys)
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"

# PeerJS (Use cloud service for production)
NEXT_PUBLIC_PEERJS_HOST="0.peerjs.com"
NEXT_PUBLIC_PEERJS_PORT="443"
NEXT_PUBLIC_PEERJS_PATH="/"
NEXT_PUBLIC_PEERJS_SECURE="true"
```

---

## Step 2: Database Setup

### 2.1 Migrate to PostgreSQL (Recommended)

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2.2 Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed production data (optional)
npm run db:seed
```

---

## Step 3: Build for Production

### 3.1 Install Dependencies

```bash
npm ci  # Clean install for production
```

### 3.2 Build the Application

```bash
npm run build
```

### 3.3 Test Production Build Locally

```bash
npm run start
```

Visit `http://localhost:3000` to verify the build works correctly.

---

## Step 4: Deploy to Vercel (Recommended)

### 4.1 Install Vercel CLI

```bash
npm i -g vercel
```

### 4.2 Login to Vercel

```bash
vercel login
```

### 4.3 Deploy

```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

### 4.4 Set Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.production`
3. Redeploy if needed

---

## Step 5: Configure Stripe Webhooks

### 5.1 Create Webhook Endpoint

In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### 5.2 Add Webhook Secret to Environment

```env
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

---

## Step 6: Set Up PeerJS Server (Optional)

### Option A: Use Cloud Service (Easiest)

Use the free PeerJS cloud service (already configured in template):

```env
NEXT_PUBLIC_PEERJS_HOST="0.peerjs.com"
NEXT_PUBLIC_PEERJS_PORT="443"
NEXT_PUBLIC_PEERJS_SECURE="true"
```

### Option B: Self-Hosted PeerJS Server

```bash
# Install PeerJS server
npm install -g peer

# Run server
peerjs --port 9000 --key peerjs --path /myapp
```

Update environment variables:

```env
NEXT_PUBLIC_PEERJS_HOST="your-server-domain.com"
NEXT_PUBLIC_PEERJS_PORT="9000"
NEXT_PUBLIC_PEERJS_PATH="/myapp"
NEXT_PUBLIC_PEERJS_SECURE="true"
```

---

## Step 7: Post-Deployment Checklist

### 7.1 Verify Core Features

- [ ] User registration works
- [ ] Login/logout functions correctly
- [ ] Dashboard loads properly
- [ ] Skill verification tests work
- [ ] Session scheduling functions
- [ ] Points system operates correctly

### 7.2 Test Video Conferencing

- [ ] Video/audio streams work
- [ ] Screen sharing functions
- [ ] Chat messages send/receive
- [ ] Session timer operates

### 7.3 Test Payment Flow

- [ ] Points purchase page loads
- [ ] Stripe checkout works
- [ ] Webhooks process correctly
- [ ] Points update after purchase

### 7.4 Performance Check

- [ ] Page load times < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Mobile responsive

---

## Step 8: Monitoring & Maintenance

### 8.1 Set Up Error Tracking (Optional)

Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for usage tracking

### 8.2 Database Backups

Set up automated backups:

```bash
# PostgreSQL backup
pg_dump -U username dbname > backup.sql

# Schedule daily backups with cron
0 2 * * * pg_dump -U username dbname > /backups/$(date +\%Y\%m\%d).sql
```

### 8.3 Monitor Performance

- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor database performance
- Track API response times
- Review error logs regularly

---

## Troubleshooting

### Issue: NextAuth JWE Decryption Error

**Solution**: Ensure `NEXTAUTH_SECRET` is set and is at least 32 characters.

```bash
# Generate new secret
openssl rand -base64 32
```

### Issue: Video Not Working

**Solution**: Check PeerJS configuration and firewall settings.

1. Verify `NEXT_PUBLIC_PEERJS_*` variables are set
2. Test PeerJS server connectivity
3. Check browser permissions for camera/microphone

### Issue: Stripe Payments Failing

**Solution**: Verify webhook configuration and API keys.

1. Check webhook endpoint is accessible
2. Verify `STRIPE_SECRET_KEY` is production key
3. Test webhook with Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Issue: Database Connection Errors

**Solution**: Check DATABASE_URL and network connectivity.

1. Verify connection string format
2. Check database server is running
3. Verify firewall allows connections
4. Test connection:

```bash
npx prisma db pull
```

---

## Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files to git
- ✅ Use different keys for dev/staging/production
- ✅ Rotate secrets regularly
- ✅ Use secret management service (AWS Secrets Manager, etc.)

### 2. API Security

- ✅ Implement rate limiting
- ✅ Validate all user inputs
- ✅ Use HTTPS only
- ✅ Enable CORS properly
- ✅ Sanitize database queries

### 3. Authentication

- ✅ Use strong NextAuth secret
- ✅ Implement session timeout
- ✅ Enable 2FA (future enhancement)
- ✅ Monitor failed login attempts

---

## Scaling Considerations

### When to Scale

Consider scaling when:
- Concurrent users > 100
- Database queries slow down
- Video sessions experience lag
- API response times > 1 second

### Scaling Strategies

1. **Database**: Migrate to managed PostgreSQL (AWS RDS, Supabase)
2. **Video**: Use dedicated WebRTC infrastructure (Agora, Twilio)
3. **Caching**: Implement Redis for session data
4. **CDN**: Use Cloudflare or AWS CloudFront
5. **Load Balancing**: Deploy multiple instances

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Stripe Docs**: https://stripe.com/docs
- **PeerJS Docs**: https://peerjs.com/docs
- **Vercel Support**: https://vercel.com/support

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server
npm run db:seed               # Seed database
npm run db:reset              # Reset and seed database

# Production
npm run build                 # Build for production
npm run start                 # Start production server
npx prisma migrate deploy     # Run migrations
npx prisma generate           # Generate Prisma client

# Database
npx prisma studio             # Open database GUI
npx prisma migrate status     # Check migration status
npx prisma db push            # Push schema changes (dev only)

# Deployment
vercel                        # Deploy to Vercel
vercel --prod                 # Deploy to production
vercel env pull               # Pull environment variables
```

---

## Conclusion

Your peer-to-peer learning platform is now production-ready! 🎉

Remember to:
- Monitor performance regularly
- Keep dependencies updated
- Back up your database
- Review security practices
- Gather user feedback

For issues or questions, refer to the troubleshooting section or consult the official documentation for each technology used.
