# Database Migration Instructions

## Run Migration 003: Personalization

The new features require database tables that need to be created. Follow these steps:

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/003_personalization.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. Verify success - you should see "Success. No rows returned"

### Option 2: Supabase CLI (if installed)

```bash
# If you have Supabase CLI installed
supabase db push
```

### What This Migration Creates

- `user_profiles` - Anonymous user tracking via session IDs
- `user_interests` - User preference weights for tags
- `event_reviews` - Event ratings and comments
- `helper_reviews` - Helper ratings and comments
- Helper photo and rating columns

### Verify Migration Success

After running the migration, check that tables exist:

```sql
-- Run this in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'user_interests', 'event_reviews', 'helper_reviews');
```

You should see all 4 tables listed.

## Next Steps After Migration

1. ✅ Migration complete
2. Test the new features:
   - Generate an itinerary (should use Gemini)
   - View events (Match Score badges will appear after user interactions)
   - Submit an event review
   - View helper profiles with photos

## Environment Variables

Make sure these are set in Vercel:
- `AI_PRIMARY=gemini`
- `DEMO_MODE=false`
- `GEMINI_API_KEY=...` (already set)
- `OPENAI_API_KEY=...` (already set)

## Testing the Features

1. **Timeline View**: Generate an itinerary and view it at `/itinerary/[id]`
2. **Match Scores**: These will appear after users interact with events
3. **Reviews**: Visit `/events/[id]` to see and submit reviews
4. **Helper Photos**: Visit `/helpers` to see helper profiles with avatars

