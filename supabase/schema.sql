-- ============================================
-- "Us" App — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Spaces: links two partners
CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Space members: maps users to spaces with roles
CREATE TABLE space_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('partner1', 'partner2')) NOT NULL,
  push_token TEXT,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(space_id, role),
  UNIQUE(space_id, user_id)
);

-- Couple profiles (one per space)
CREATE TABLE couple_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE UNIQUE,
  couple_photo_url TEXT,
  anniversary_date DATE NOT NULL,
  relationship_type TEXT CHECK (relationship_type IN ('local', 'ldr')) NOT NULL,
  theme TEXT CHECK (theme IN ('rose', 'lavender', 'sunset', 'ocean')) NOT NULL DEFAULT 'rose',
  shared_bio TEXT,
  our_song JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Individual profiles
CREATE TABLE individual_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('partner1', 'partner2')) NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  birthday DATE,
  location JSONB,
  love_language TEXT,
  current_status JSONB,
  song_of_the_day JSONB,
  fun_facts JSONB DEFAULT '[]',
  best_quality_by_partner TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(space_id, role)
);

-- Nicknames
CREATE TABLE nicknames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  for_partner TEXT NOT NULL,
  given_by TEXT NOT NULL,
  nickname TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  given_at TIMESTAMPTZ DEFAULT now()
);

-- Love notes
CREATE TABLE love_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Memories
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Milestones (timeline)
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Countdown events
CREATE TABLE countdown_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_date TIMESTAMPTZ NOT NULL,
  emoji TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bucket list items
CREATE TABLE bucket_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('this-week', 'this-month', 'someday')) NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mood entries
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  partner TEXT NOT NULL,
  mood TEXT NOT NULL,
  note TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Date ideas
CREATE TABLE date_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  is_custom BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Journal letters
CREATE TABLE journal_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  week_key TEXT NOT NULL,
  reveal_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily question entries
CREATE TABLE daily_question_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  date_key TEXT NOT NULL,
  partner1_answer TEXT,
  partner2_answer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Song dedications
CREATE TABLE song_dedications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  dedicated_by TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  url TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Location entries
CREATE TABLE location_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  partner TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  city_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Partner notes (NEW FEATURE)
CREATE TABLE partner_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  about_partner TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN (
    'things-i-love', 'noticed-today', 'why-amazing', 'gratitude', 'memories-of-us'
  )) NOT NULL,
  is_discovered BOOLEAN DEFAULT false,
  discovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Thinking of you taps
CREATE TABLE thinking_of_you (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  from_partner TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sleep/wake status
CREATE TABLE sleep_wake_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  partner TEXT NOT NULL,
  status TEXT CHECK (status IN ('sleeping', 'awake')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row-Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nicknames ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE countdown_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_question_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_dedications ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE thinking_of_you ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_wake_status ENABLE ROW LEVEL SECURITY;

-- Spaces: users can read spaces they created or belong to, and insert new ones
CREATE POLICY "Users can read their spaces"
  ON spaces FOR SELECT
  USING (
    created_by = auth.uid()
    OR id IN (SELECT user_space_ids())
  );

CREATE POLICY "Users can create spaces"
  ON spaces FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Space members: users can read/insert members for their spaces
-- Uses user_space_ids() (SECURITY DEFINER) to avoid infinite recursion
CREATE POLICY "Users can read space members"
  ON space_members FOR SELECT
  USING (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Users can join spaces"
  ON space_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own member record"
  ON space_members FOR UPDATE
  USING (user_id = auth.uid());

-- Helper function to check space membership
CREATE OR REPLACE FUNCTION user_space_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT space_id FROM space_members WHERE user_id = auth.uid()
$$;

-- Generic policy for all data tables (space-scoped access)
-- We'll use a macro approach for each table

CREATE POLICY "Space access" ON couple_profiles FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON individual_profiles FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON nicknames FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON love_notes FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON memories FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON milestones FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON countdown_events FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON bucket_items FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON mood_entries FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON date_ideas FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON journal_letters FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON daily_question_entries FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON song_dedications FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON location_entries FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON partner_notes FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON thinking_of_you FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

CREATE POLICY "Space access" ON sleep_wake_status FOR ALL
  USING (space_id IN (SELECT user_space_ids()))
  WITH CHECK (space_id IN (SELECT user_space_ids()));

-- ============================================
-- Storage bucket for photos
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('couple-photos', 'couple-photos', false);

CREATE POLICY "Space members can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'couple-photos'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM spaces WHERE id IN (SELECT user_space_ids())
    )
  );

CREATE POLICY "Space members can read photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'couple-photos'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM spaces WHERE id IN (SELECT user_space_ids())
    )
  );

CREATE POLICY "Space members can delete photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'couple-photos'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM spaces WHERE id IN (SELECT user_space_ids())
    )
  );

-- ============================================
-- Enable Realtime on all tables
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE couple_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE individual_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE nicknames;
ALTER PUBLICATION supabase_realtime ADD TABLE love_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE memories;
ALTER PUBLICATION supabase_realtime ADD TABLE milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE countdown_events;
ALTER PUBLICATION supabase_realtime ADD TABLE bucket_items;
ALTER PUBLICATION supabase_realtime ADD TABLE mood_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE date_ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE journal_letters;
ALTER PUBLICATION supabase_realtime ADD TABLE daily_question_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE song_dedications;
ALTER PUBLICATION supabase_realtime ADD TABLE location_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE partner_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE thinking_of_you;
ALTER PUBLICATION supabase_realtime ADD TABLE sleep_wake_status;
