This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Environment Variables (Required)

Set these in your Vercel project settings:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE` - Your Supabase service role key (for server-side writes)
- `NEXT_PUBLIC_BASE_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

**Optional (for AI features):**
- `OPENAI_API_KEY` - OpenAI API key for itinerary generation
- `GEMINI_API_KEY` - Google Gemini API key (fallback for itinerary generation)

**Feature Flags:**
- `FEATURE_HELPERS=true` - Enable helpers directory
- `FEATURE_REALTIME=true` - Enable Supabase Realtime features
- `DEMO_MODE=true` - Enable demo mode

### Smoke Tests

After deployment, verify these endpoints:

```bash
# Health check (should show all env vars present)
curl https://your-app.vercel.app/api/health

# Events API (should return 200, even if empty)
curl https://your-app.vercel.app/api/events?city=Kingston

# Itinerary generation
curl -X POST https://your-app.vercel.app/api/ai/itinerary \
  -H "Content-Type: application/json" \
  -d '{"city":"Kingston","date":"2024-01-15","interests":["music","food"]}'

# Helpers search
curl https://your-app.vercel.app/api/helpers/search?city=Kingston
```

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
