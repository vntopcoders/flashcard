# Deployment Guide

## Required Environment Variables

This application requires several environment variables to be configured for deployment. Here's how to set them up:

### Vercel Environment Variables

Set these in your Vercel dashboard under **Project Settings > Environment Variables**:

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### NextAuth Configuration
```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret_key_32_chars_min
```

#### Google OAuth Configuration
```
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

#### Google Cloud TTS Configuration (Optional)
```
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_APPLICATION_CREDENTIALS=your_service_account_json_key
USE_MOCK_TTS=false
```

## Setup Steps

### 1. Supabase Setup
1. Create a new Supabase project
2. Run the SQL scripts in this order:
   - `supabase-auth-setup-fixed.sql` (NextAuth tables)
   - `supabase-ielts-setup.sql` (IELTS vocabulary data)
3. Get your project URL and keys from Supabase dashboard

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your Vercel domain to authorized origins

### 3. NextAuth Secret
Generate a random secret:
```bash
openssl rand -base64 32
```

### 4. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set all environment variables in Vercel dashboard
3. Deploy!

## Build Troubleshooting

If you encounter the error `supabaseKey is required`, ensure that:
- `SUPABASE_SERVICE_ROLE_KEY` is set in your Vercel environment variables
- The key has the correct permissions in Supabase
- The environment variable name exactly matches `SUPABASE_SERVICE_ROLE_KEY`

## Database Schema

The application requires two database schemas:
- `next_auth` schema for authentication tables
- `public` schema for IELTS vocabulary and user data

Run the SQL setup scripts in your Supabase SQL editor to create all required tables and indexes.