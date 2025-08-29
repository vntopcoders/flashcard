-- =====================================================
-- NEXT-AUTH SUPABASE SETUP (Fixed Version)
-- Tables required for NextAuth.js with Supabase
-- =====================================================

-- Create next_auth schema
CREATE SCHEMA IF NOT EXISTS next_auth;

-- =====================================================
-- 1. ACCOUNTS TABLE
-- Stores OAuth account information  
-- =====================================================
CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  oauth_token_secret TEXT,
  oauth_token TEXT,
  
  CONSTRAINT accounts_provider_providerAccountId_key UNIQUE (provider, "providerAccountId")
);

-- =====================================================
-- 2. SESSIONS TABLE  
-- Stores user sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" TEXT NOT NULL UNIQUE
);

-- =====================================================
-- 3. USERS TABLE
-- Extended user information
-- =====================================================
CREATE TABLE IF NOT EXISTS next_auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  
  -- Extended fields for our IELTS app
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  current_level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  target_band_score DECIMAL(2,1) DEFAULT 6.5, -- IELTS target score
  study_streak INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0, -- in minutes
  preferred_study_time TEXT DEFAULT 'morning', -- morning, afternoon, evening
  timezone TEXT DEFAULT 'UTC'
);

-- =====================================================
-- 4. VERIFICATION TOKENS TABLE
-- For email verification
-- =====================================================
CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  
  CONSTRAINT verification_tokens_identifier_token_key UNIQUE (identifier, token)
);

-- =====================================================
-- 5. USER PREFERENCES TABLE
-- Detailed user preferences and settings
-- =====================================================
CREATE TABLE IF NOT EXISTS next_auth.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  
  -- Audio settings
  preferred_accent TEXT DEFAULT 'US' CHECK (preferred_accent IN ('US', 'UK', 'AU')),
  auto_play BOOLEAN DEFAULT FALSE,
  playback_speed DECIMAL(2,1) DEFAULT 1.0 CHECK (playback_speed >= 0.5 AND playback_speed <= 2.0),
  volume DECIMAL(2,1) DEFAULT 0.8 CHECK (volume >= 0.0 AND volume <= 1.0),
  enable_offline_cache BOOLEAN DEFAULT TRUE,
  
  -- Study preferences
  daily_word_target INTEGER DEFAULT 20,
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '09:00:00',
  
  -- Display preferences
  show_ipa BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT FALSE,
  language_interface TEXT DEFAULT 'vi' CHECK (language_interface IN ('en', 'vi')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. USER STUDY SESSIONS TABLE
-- Track individual study sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS next_auth.user_study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  
  session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  session_duration INTEGER, -- in seconds
  
  -- Session statistics
  words_studied INTEGER DEFAULT 0,
  words_mastered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  
  session_type TEXT DEFAULT 'review' CHECK (session_type IN ('review', 'new_words', 'test', 'practice')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_accounts_userId ON next_auth.accounts("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_userId ON next_auth.sessions("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON next_auth.sessions(expires);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON next_auth.verification_tokens(expires);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON next_auth.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_study_sessions_user_id ON next_auth.user_study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_study_sessions_start ON next_auth.user_study_sessions(session_start);

-- =====================================================
-- FUNCTIONS and TRIGGERS (Simplified)
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION next_auth.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

-- Triggers for updated_at (drop first if exists, then create)
DROP TRIGGER IF EXISTS trigger_users_updated_at ON next_auth.users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON next_auth.users
  FOR EACH ROW EXECUTE FUNCTION next_auth.update_updated_at();

DROP TRIGGER IF EXISTS trigger_user_preferences_updated_at ON next_auth.user_preferences;
CREATE TRIGGER trigger_user_preferences_updated_at
  BEFORE UPDATE ON next_auth.user_preferences
  FOR EACH ROW EXECUTE FUNCTION next_auth.update_updated_at();

-- =====================================================
-- DEFAULT USER PREFERENCES INSERT FUNCTION
-- Auto-create preferences when user registers
-- =====================================================

CREATE OR REPLACE FUNCTION next_auth.create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO next_auth.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language plpgsql;

-- Trigger to auto-create preferences (drop first if exists, then create)
DROP TRIGGER IF EXISTS trigger_create_user_preferences ON next_auth.users;
CREATE TRIGGER trigger_create_user_preferences
  AFTER INSERT ON next_auth.users
  FOR EACH ROW EXECUTE FUNCTION next_auth.create_user_preferences();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$ 
BEGIN
  RAISE NOTICE 'NextAuth Supabase setup completed successfully!';
  RAISE NOTICE 'Created schema: next_auth';
  RAISE NOTICE 'Created tables: accounts, sessions, users, verification_tokens, user_preferences, user_study_sessions';
  RAISE NOTICE 'Created indexes and triggers';
END $$;