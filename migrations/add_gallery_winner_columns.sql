-- Migration: Add missing columns to gallery_submissions table
-- Date: 2025-12-15
-- Issue: column "coupon_code" does not exist error on /api/gallery/submissions

-- Add winner-related columns to gallery_submissions table
ALTER TABLE gallery_submissions 
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS is_winner BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS winner_month TEXT,
  ADD COLUMN IF NOT EXISTS prize TEXT,
  ADD COLUMN IF NOT EXISTS has_seen_celebration BOOLEAN DEFAULT FALSE;

-- Confirmation
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'gallery_submissions';
