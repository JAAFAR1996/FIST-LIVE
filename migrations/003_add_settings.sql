-- Migration: Add Settings Table
-- Description: Create settings table for storing store configuration

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Initial default settings
INSERT INTO settings (key, value) VALUES 
  ('store_name', 'AQUAVO'),
  ('support_email', 'support@aquavo.iq'),
  ('maintenance_mode', 'false'),
  ('orders_enabled', 'true')
ON CONFLICT (key) DO NOTHING;
