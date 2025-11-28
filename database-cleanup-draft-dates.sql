-- Draft Date Cleanup - Database Migration
-- Run this in Supabase SQL Editor

-- Remove scheduled_for dates from all drafts
-- Drafts should never have a scheduled date
UPDATE posts
SET scheduled_for = NULL
WHERE status = 'draft';

-- Fix any obviously invalid dates (before 2024)
-- This catches any posts with corrupted or test dates
UPDATE posts
SET scheduled_for = NULL
WHERE scheduled_for < '2024-01-01';

-- Optional: View posts that were affected
-- Uncomment to see what was cleaned up
-- SELECT id, status, scheduled_for, created_at
-- FROM posts
-- WHERE status = 'draft' OR scheduled_for < '2024-01-01';
