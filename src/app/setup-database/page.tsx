'use client'

import { useState } from 'react'
import { CheckCircle, Copy, Database, ExternalLink } from 'lucide-react'

export default function SetupDatabasePage() {
  const [step, setStep] = useState(0)
  const [copied, setCopied] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  const sqlScripts = [
    {
      title: "1. NextAuth Tables (Authentication)",
      description: "Tạo các bảng cơ bản cho authentication system",
      filename: "nextauth-supabase-setup.sql",
      content: `-- NextAuth.js Supabase Setup
-- Run this SQL in Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create accounts table  
CREATE TABLE IF NOT EXISTS accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, "providerAccountId")
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (identifier, token)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts("userId");
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions("userId");
CREATE INDEX IF NOT EXISTS sessions_session_token_idx ON sessions("sessionToken");

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Enable insert for service role" ON users
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable update for service role" ON users
    FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Enable all for service role on accounts" ON accounts
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all for service role on sessions" ON sessions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all for service role on verification_tokens" ON verification_tokens
    FOR ALL USING (auth.role() = 'service_role');

SELECT 'NextAuth tables created successfully!' as message;`
    },
    {
      title: "2. Grammar Tables (Study Content)",
      description: "Tạo các bảng cho grammar content và study materials",
      filename: "supabase-grammar-setup.sql",
      content: `-- Grammar Content Tables
-- Run this SQL in Supabase SQL Editor

-- Create grammar_topics table
CREATE TABLE IF NOT EXISTS grammar_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    theory_vietnamese TEXT NOT NULL,
    theory_english TEXT,
    difficulty_level INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create grammar_key_points table
CREATE TABLE IF NOT EXISTS grammar_key_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grammar_topic_id UUID NOT NULL REFERENCES grammar_topics(id) ON DELETE CASCADE,
    point_vietnamese TEXT NOT NULL,
    point_english TEXT,
    example_sentence TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create study_resources table
CREATE TABLE IF NOT EXISTS study_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    week_number INTEGER NOT NULL,
    resource_type TEXT NOT NULL, -- 'lesson', 'grammar', 'exercise'
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- email from NextAuth
    current_week INTEGER DEFAULT 1,
    current_day INTEGER DEFAULT 1,
    vocabulary_learned INTEGER DEFAULT 0,
    grammar_completed INTEGER DEFAULT 0,
    mock_tests_completed INTEGER DEFAULT 0,
    study_days INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS grammar_topics_week_idx ON grammar_topics(week_number);
CREATE INDEX IF NOT EXISTS grammar_key_points_topic_idx ON grammar_key_points(grammar_topic_id);
CREATE INDEX IF NOT EXISTS study_resources_week_idx ON study_resources(week_number);
CREATE INDEX IF NOT EXISTS user_progress_user_idx ON user_progress(user_id);

SELECT 'Grammar tables created successfully!' as message;`
    }
  ]

  const testConnection = async () => {
    try {
      const response = await fetch('/api/grammar/week/1')
      const result = await response.json()
      
      if (response.ok) {
        alert('✅ Database connection successful! Grammar system is ready.')
      } else {
        alert(`❌ Error: ${result.error}. Please run the SQL scripts first.`)
      }
    } catch (error) {
      alert('❌ Connection failed. Please check your setup.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🔧 Database Setup Guide
        </h1>
        <p className="text-gray-600">
          Follow these steps to set up your Supabase database for the IELTS Study Plan
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div
            key={stepNum}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= stepNum - 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step > stepNum - 1 ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              stepNum
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Instructions */}
      {step === 0 && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-6 h-6" />
            Before You Start
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>1. Make sure you have access to your Supabase dashboard</p>
            <p>2. Navigate to the SQL Editor in your Supabase project</p>
            <p>3. You&apos;ll run 2 SQL scripts to set up all necessary tables</p>
          </div>
          
          <div className="mt-6 flex gap-4">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Supabase Dashboard
            </a>
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Setup →
            </button>
          </div>
        </div>
      )}

      {/* SQL Scripts */}
      {step > 0 && step <= sqlScripts.length && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">
            {sqlScripts[step - 1].title}
          </h2>
          <p className="text-gray-600 mb-4">
            {sqlScripts[step - 1].description}
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {sqlScripts[step - 1].filename}
              </span>
              <button
                onClick={() => copyToClipboard(sqlScripts[step - 1].content, step - 1)}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
              >
                {copied === step - 1 ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied === step - 1 ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <pre className="text-sm bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto max-h-96">
              <code>{sqlScripts[step - 1].content}</code>
            </pre>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={step === 1}
            >
              ← Previous
            </button>
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {step === sqlScripts.length ? 'Test Connection' : 'Next →'}
            </button>
          </div>
        </div>
      )}

      {/* Final Step: Test */}
      {step > sqlScripts.length && (
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            🎉 Setup Complete!
          </h2>
          <p className="text-gray-700 mb-6">
            All SQL scripts have been provided. Click below to test your database connection.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={testConnection}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              🔍 Test Database Connection
            </button>
            
            <div className="text-sm text-gray-600">
              <p>If the test passes, your grammar system is ready!</p>
              <p>You can now go back to the Study Plan and see grammar content from the database.</p>
            </div>

            <a
              href="/study-plan"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Study Plan →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}