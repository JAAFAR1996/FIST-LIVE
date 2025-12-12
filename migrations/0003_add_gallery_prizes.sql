-- Migration: Add gallery_prizes table
-- Date: 2025-01-10
-- Description: Create table for storing monthly gallery prizes persistently

CREATE TABLE IF NOT EXISTS gallery_prizes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL UNIQUE,
  prize TEXT NOT NULL,
  discount_code TEXT,
  discount_percentage INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on month for faster lookups
CREATE INDEX IF NOT EXISTS idx_gallery_prizes_month ON gallery_prizes(month);
CREATE INDEX IF NOT EXISTS idx_gallery_prizes_active ON gallery_prizes(is_active);

-- Insert default prize for current month if none exists
INSERT INTO gallery_prizes (month, prize, discount_code, discount_percentage, is_active)
VALUES (
  to_char(CURRENT_DATE, 'TMMonth YYYY'),
  'كوبون خصم 20%',
  'GALLERY20',
  20,
  true
)
ON CONFLICT (month) DO NOTHING;

COMMENT ON TABLE gallery_prizes IS 'Stores monthly prizes for community gallery winners';
COMMENT ON COLUMN gallery_prizes.month IS 'Month identifier (e.g., "كانون الثاني 2025")';
COMMENT ON COLUMN gallery_prizes.is_active IS 'Whether this prize is currently active';
