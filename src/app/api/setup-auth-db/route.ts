import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// This endpoint should only be used once for setup, then disabled
export async function POST() {
  try {
    // Use service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const setupSQL = `
-- Create next_auth schema
CREATE SCHEMA IF NOT EXISTS next_auth;

-- ACCOUNTS TABLE
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

-- SESSIONS TABLE
CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" TEXT NOT NULL UNIQUE
);

-- USERS TABLE
CREATE TABLE IF NOT EXISTS next_auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  current_level TEXT DEFAULT 'beginner',
  target_band_score DECIMAL(2,1) DEFAULT 6.5,
  study_streak INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0,
  preferred_study_time TEXT DEFAULT 'morning',
  timezone TEXT DEFAULT 'UTC'
);

-- VERIFICATION TOKENS TABLE
CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  
  CONSTRAINT verification_tokens_identifier_token_key UNIQUE (identifier, token)
);

-- USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS next_auth.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  preferred_accent TEXT DEFAULT 'US' CHECK (preferred_accent IN ('US', 'UK', 'AU')),
  auto_play BOOLEAN DEFAULT FALSE,
  playback_speed DECIMAL(2,1) DEFAULT 1.0 CHECK (playback_speed >= 0.5 AND playback_speed <= 2.0),
  volume DECIMAL(2,1) DEFAULT 0.8 CHECK (volume >= 0.0 AND volume <= 1.0),
  enable_offline_cache BOOLEAN DEFAULT TRUE,
  daily_word_target INTEGER DEFAULT 20,
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '09:00:00',
  show_ipa BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT FALSE,
  language_interface TEXT DEFAULT 'vi' CHECK (language_interface IN ('en', 'vi')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_accounts_userId ON next_auth.accounts("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_userId ON next_auth.sessions("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON next_auth.sessions(expires);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON next_auth.verification_tokens(expires);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON next_auth.user_preferences(user_id);
    `

    // Execute the setup SQL
    const { data, error } = await supabase.rpc('exec', {
      sql: setupSQL
    })

    if (error) {
      console.error('Database setup error:', error)
      return NextResponse.json(
        { error: 'Database setup failed', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'NextAuth database tables created successfully!',
      data
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : error },
      { status: 500 }
    )
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Auth DB Setup endpoint ready. Use POST to run setup.',
    warning: 'This endpoint should only be used once, then disabled for security.'
  })
}