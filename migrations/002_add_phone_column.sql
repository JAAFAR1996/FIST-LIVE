-- Migration: Add Phone Column to Users
-- Description: Add phone column to users table
-- Date: 2025-12-06

-- Add phone column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add comment for documentation
COMMENT ON COLUMN users.phone IS 'User phone number';
