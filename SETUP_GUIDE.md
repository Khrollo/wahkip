# Wahkip AI Upgrade - Complete Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Run Database Migration (REQUIRED)

**Go to Supabase Dashboard:**
1. Visit: https://supabase.com/dashboard
2. Select your Wahkip project
3. Click **SQL Editor** in left sidebar
4. Click **New Query**
5. Copy ALL contents from `supabase/migrations/003_personalization.sql`
6. Paste and click **Run**
7. ✅ You should see: "Success. No rows returned"

### Step 2: Set Environment Variables in Vercel (REQUIRED)

**Go to Vercel Dashboard:**
1. Visit: https://vercel.com/kejhwan-browns-projects/wahkip/settings/environment-variables
2. Add/Update these variables:

```bash
# Set AI to use Gemini as primary
AI_PRIMARY=gemini

# Enable AI (not demo mode)
DEMO_MODE=false

# Already set, just verify:
GEMINI_API_KEY=... (your key)
OPENAI_API_KEY=... (your key)
```

3. Click **Save**
4. Redeploy: `vercel --prod --yes`

### Step 3: Test the Features

#### ✅ Timeline View (Already Working!)
Visit: https://wahkip.vercel.app
- Generate an itinerary
- Click "View & Share" 
- See the new timeline with morning/midday/afternoon/evening blocks

#### ✅ Helper Photos (Already Working!)
Visit: https://wahkip.vercel.app/helpers
- See helper profiles with avatar images
- Click WhatsApp buttons

#### ⏳ Match Scores (Need Migration)
- Will appear after running migration
- Users interact with events → scores calculated

#### ⏳ Event Reviews (Need Migration)
Visit: https://wahkip.vercel.app/events/[event-id]
- Will work after running migration
- Submit star ratings and comments

## 🔧 What Each Feature Does

### 1. **Timeline View** ✅ Working Now
- Beautiful calendar-style itinerary display
- Time blocks: 09:00 Morning, 12:00 Midday, 15:00 Afternoon, 19:00 Evening
- Transport notes and cost estimates

### 2. **Helper Photos** ✅ Working Now
- Helper avatars using UI Avatars API
- WhatsApp integration
- Rating display

### 3. **Match Scores** ⏳ Needs Migration
- Cosine similarity algorithm
- Shows % match based on user preferences
- Updates as users view/like/save events

### 4. **Event Reviews** ⏳ Needs Migration
- Star ratings (1-5)
- Text comments
- Anonymous user tracking via session IDs

### 5. **Gemini AI** ⏳ Needs Environment Variable
- Primary AI for itinerary generation
- Falls back to OpenAI if Gemini fails
- Deterministic fallback if both fail

## 🐛 Troubleshooting

### "DEMO_MODE" warning in itinerary
**Fix:** Set `DEMO_MODE=false` in Vercel environment variables

### Match scores not showing
**Fix:** Run the database migration (Step 1)

### Reviews not working
**Fix:** Run the database migration (Step 1)

### AI still using fallback
**Fix:** 
1. Set `DEMO_MODE=false`
2. Set `AI_PRIMARY=gemini`
3. Redeploy

## 📊 Current Status

| Feature | Status | Needs |
|---------|--------|-------|
| Timeline View | ✅ Working | None |
| Helper Photos | ✅ Working | None |
| Gemini AI | ⏳ Ready | Env vars |
| Match Scores | ⏳ Ready | Migration |
| Event Reviews | ⏳ Ready | Migration |

## 🎯 Next Steps

1. **Run migration** (5 min) → Unlocks reviews & match scores
2. **Set env vars** (2 min) → Unlocks Gemini AI
3. **Test everything** → Enjoy the new features!

---

**Need help?** Check the error messages - they'll tell you exactly what's missing!

