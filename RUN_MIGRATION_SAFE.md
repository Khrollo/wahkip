# Safe Migration Instructions

## ✅ Use This Migration Instead

The original migration failed because some objects already exist. Use the **safe** version instead.

## Steps to Run Safe Migration:

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your Wahkip project
   - Click **SQL Editor** in left sidebar
   - Click **New Query**

2. **Copy the Safe Migration:**
   - Open file: `supabase/migrations/003_personalization_safe.sql`
   - Copy ALL contents

3. **Paste and Run:**
   - Paste into SQL Editor
   - Click **Run** (or press Ctrl+Enter)
   - ✅ You should see: "Success. No rows returned"

## What's Different in the Safe Version?

The safe migration:
- ✅ Uses `DROP POLICY IF EXISTS` before creating policies
- ✅ Checks if columns exist before adding them
- ✅ Won't fail if objects already exist
- ✅ Can be run multiple times safely

## Verify Migration Success

After running, check that tables exist:

```sql
-- Run this in SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'user_interests', 'event_reviews', 'helper_reviews');
```

You should see all 4 tables listed.

## What This Enables

After running this migration:
- ✅ Event reviews (star ratings + comments)
- ✅ Match scores (personalized recommendations)
- ✅ Helper photos and ratings
- ✅ Anonymous user tracking

## Next Steps

1. ✅ Run safe migration
2. Set environment variables in Vercel:
   - `AI_PRIMARY=gemini`
   - `DEMO_MODE=false`
3. Test the new features!

---

**File to use:** `supabase/migrations/003_personalization_safe.sql`

