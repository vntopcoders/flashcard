# Database Migration Fix for Spaced Repetition System

## Issue

The home page was showing a 400 Bad Request error with this URL:
```
GET https://mfwhgaorqequaeagjfse.supabase.co/rest/v1/card_schedule?user_id=eq.vntopcoders%40gmail.com
```

**Root Cause**: The application has two different spaced repetition systems:
1. Single-user system (`SpacedRepetitionService`) - no `user_id` in database
2. Multi-user system (`UserSpacedRepetitionService`) - expects `user_id` in database

Some components were trying to use the multi-user system but the database schema only supports single-user.

## Quick Fix Applied

**Changed components to use single-user system:**
- `src/components/DailyDashboard.tsx` - Changed from `UserSpacedRepetitionService` to `SpacedRepetitionService`
- `src/components/ProgressDashboard.tsx` - Changed from `UserSpacedRepetitionService` to `SpacedRepetitionService`

## Permanent Solution (To Be Applied Later)

### Option 1: Add user_id columns to database (Recommended)

Run the SQL migration file: `supabase-user-migration.sql`

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase-user-migration.sql`
3. Execute the SQL commands
4. Revert the component changes to use `UserSpacedRepetitionService`

### Option 2: Remove multi-user system

Delete `src/lib/user-spaced-repetition.ts` and update all components to use single-user system.

## Files Modified

### Fixed Components
- `src/components/DailyDashboard.tsx` - Line 21, 75-76
- `src/components/ProgressDashboard.tsx` - Line 17, 80-82, 90

### Migration Files Created
- `supabase-user-migration.sql` - Complete database migration
- `src/app/api/migrate-user-schema/route.ts` - Migration API endpoint (optional)

## Current Status

✅ **FIXED**: Home page error resolved  
⚠️  **TEMPORARY**: Using single-user system as fallback  
📋 **TODO**: Apply database migration for full multi-user support

The application should now work without the 400 error on the home page.