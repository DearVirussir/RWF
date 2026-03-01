-- Rustam Welfare Foundation Supabase Schema
-- IMPORTANT: Copy and paste this entire script into your Supabase SQL Editor and click "Run".

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* --- 1. Users table (for admin login) --- */
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

/* --- 2. Cases table (Case Management) --- */
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_needed DECIMAL(12, 2) NOT NULL DEFAULT 0,
  amount_raised DECIMAL(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'Active', -- 'Active', 'Completed'
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

/* --- 3. Gallery table (Updated with description and event_date) --- */
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- If the table already existed but columns are missing, this will add them:
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery' AND column_name='description') THEN
        ALTER TABLE public.gallery ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery' AND column_name='event_date') THEN
        ALTER TABLE public.gallery ADD COLUMN event_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

/* --- 4. Updates table (Progress Updates) --- */
CREATE TABLE IF NOT EXISTS public.progress_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Handle case where it might have been named 'updates'
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='updates') AND 
       NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='progress_updates') THEN
        ALTER TABLE public.updates RENAME TO progress_updates;
    END IF;
END $$;


/* --- 5. Donations table --- */
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

/* --- 6. Contact_messages table --- */
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

/* --- 7. Staff table (Staff & Volunteers) --- */
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

/* --- 8. Newsletter Subscriptions Table --- */
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

/* --- 9. Special Appeals Table --- */
CREATE TABLE IF NOT EXISTS public.special_appeals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  goal_amount DECIMAL(12, 2) DEFAULT 0,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_ramadan_theme BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert the current Ramadan 2026 data as a starting point
INSERT INTO public.special_appeals (title, subtitle, description, goal_amount, current_amount, image_url, is_active, is_ramadan_theme)
VALUES (
  'Ramadan 2026 Special Appeal',
  'Eid Shopping for 600+ Orphans & Rashan Distribution',
  'Once again, in this Ramadan, we are committed to providing Eid shopping for our orphans and food packages for widows.',
  2000000,
  200000,
  'https://i.ibb.co/QjDjVVZN/ramadan.jpg',
  TRUE,
  TRUE
) ON CONFLICT DO NOTHING;

-- NOTE: If you still see "column not found" errors in your browser after running this,
-- please go to the Supabase Dashboard > API Settings and look for a way to "Refresh Schema Cache" 
-- or simply wait a few seconds for the cache to update automatically.

/* --- 9. RLS Policies (CRITICAL for public forms) --- */

-- Enable RLS on public tables
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages (Public Contact Form)
DROP POLICY IF EXISTS "Allow public insert" ON public.contact_messages;
CREATE POLICY "Allow public insert" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Allow anyone to subscribe (Public Newsletter)
DROP POLICY IF EXISTS "Allow public subscribe" ON public.newsletter_subscriptions;
CREATE POLICY "Allow public subscribe" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);

-- Allow admins to read/manage (This is simplified, usually you'd use auth roles)
-- For now, we assume the admin panel handles auth before calling these.
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_appeals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_updates DISABLE ROW LEVEL SECURITY;

/* 
  --- 10. SUPABASE STORAGE SETUP ---
  If your image uploads fail, please run the following SQL or ensure 
  your "foundation" bucket is PUBLIC and has RLS policies.
*/

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('foundation', 'foundation', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload files
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'foundation');

-- Policy to allow authenticated users to update files
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'foundation');

-- Policy to allow authenticated users to delete files
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'foundation');

-- Policy to allow public to view files
DROP POLICY IF EXISTS "Allow public views" ON storage.objects;
CREATE POLICY "Allow public views"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'foundation');

