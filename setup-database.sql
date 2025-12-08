-- ============================================
-- Supabase Database Setup Script
-- Run this entire script in your Supabase SQL Editor
-- WARNING: This will DELETE all existing data in these tables!
-- ============================================

-- ============================================
-- STEP 1: Drop existing tables and policies
-- ============================================

-- Drop all policies first
DROP POLICY IF EXISTS "Allow public insert" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated read" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated update" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated delete" ON contact_submissions;

DROP POLICY IF EXISTS "Allow public insert" ON onboarding_requests;
DROP POLICY IF EXISTS "Allow authenticated read" ON onboarding_requests;
DROP POLICY IF EXISTS "Allow authenticated update" ON onboarding_requests;
DROP POLICY IF EXISTS "Allow authenticated delete" ON onboarding_requests;

DROP POLICY IF EXISTS "Allow authenticated all" ON residents;

-- Drop tables (CASCADE will handle any dependencies)
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS onboarding_requests CASCADE;
DROP TABLE IF EXISTS residents CASCADE;

-- ============================================
-- STEP 2: Create tables with updated schema
-- ============================================

-- 1. Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for form submissions)
-- Using 'public' role ensures both anonymous and authenticated users can insert
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only authenticated users can read
CREATE POLICY "Allow authenticated read" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Allow authenticated update" ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete
CREATE POLICY "Allow authenticated delete" ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- 2. Create onboarding_requests table
CREATE TABLE onboarding_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  pregnancy_status TEXT,
  current_situation TEXT NOT NULL,
  needs_description TEXT NOT NULL,
  referral_source TEXT,
  status TEXT DEFAULT 'Pending Review',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE onboarding_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for form submissions)
-- Using 'public' role ensures both anonymous and authenticated users can insert
CREATE POLICY "Allow public insert" ON onboarding_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only authenticated users can read
CREATE POLICY "Allow authenticated read" ON onboarding_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Allow authenticated update" ON onboarding_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete
CREATE POLICY "Allow authenticated delete" ON onboarding_requests
  FOR DELETE
  TO authenticated
  USING (true);

-- 3. Create residents table
CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  move_in_date DATE NOT NULL,
  expected_exit_date DATE,
  case_manager TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read/write
CREATE POLICY "Allow authenticated all" ON residents
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Verification Queries (optional - run to verify)
-- ============================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('contact_submissions', 'onboarding_requests', 'residents');

-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('contact_submissions', 'onboarding_requests', 'residents');

-- ============================================
-- STEP 4: Create settings table
-- ============================================

-- Drop existing settings table if it exists
DROP TABLE IF EXISTS settings CASCADE;

-- Create settings table
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  capacity INTEGER NOT NULL DEFAULT 12,
  contact_email TEXT NOT NULL DEFAULT 'info@agapesafetynest.org',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable Row Level Security (RLS)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read/write
CREATE POLICY "Allow authenticated all" ON settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default settings
INSERT INTO settings (id, capacity, contact_email) 
VALUES (1, 12, 'info@agapesafetynest.org')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 5: Disable RLS for public form tables
-- ============================================

-- Disable Row Level Security for contact_submissions (allows public access)
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Disable Row Level Security for onboarding_requests (allows public access)
ALTER TABLE onboarding_requests DISABLE ROW LEVEL SECURITY;

