# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server at localhost:3000
- `npm run build` - Build for production
- `npm run lint` - Run ESLint checks
- `npm run start` - Start production server
- `npm run db:seed` - Seed database with sample data using npx tsx prisma/seed.ts

### Database Operations
- Supabase: Use SQL Editor in dashboard to run migrations from `supabase-ielts-setup.sql`
- Prisma (dev): Schema in `prisma/schema.prisma`, seed with `npm run db:seed`

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
- **Database**: Dual setup - Supabase PostgreSQL (production) + Prisma SQLite (development)
- **API**: Next.js API routes in `/src/app/api/`
- **Icons**: Lucide React

### Key Components
- **FlashcardComponent** (`/src/components/FlashcardComponent.tsx`) - Main interactive flashcard with flip animation, audio, and navigation
- **LessonManager** (`/src/components/LessonManager.tsx`) - Handles lesson-based flashcard organization (20 words per lesson)
- **AddFlashcardForm** - Form for creating new vocabulary entries
- **Audio/Image Hooks** (`/src/hooks/`) - Custom hooks for media integration with external APIs

### Database Schema
The app uses a structured IELTS vocabulary system:
- **Flashcards table**: word, meaning, pronunciation_guide, difficulty_level, category, lesson_id, ipa_transcription
- **Lessons table**: Groups flashcards into manageable chunks (typically 20 words)
- **Categories**: Organized by IELTS topics (academic, general, etc.)

### API Patterns
- `/api/flashcards` - CRUD operations for flashcards
- `/api/add-ipa-column/` - Database migration endpoint  
- `/api/count-flashcards/` - Statistics endpoint
- `/api/migrate-database/` - Data migration utilities
- `/api/test-simple-flashcard/` - Testing endpoint

All API routes follow Next.js App Router conventions and use either Supabase client or Prisma for database operations.

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
# Note: Move external API keys (Unsplash, etc.) to server-side only
```

### Important Architectural Notes
- **Dual Database Setup**: The project maintains both Prisma (SQLite) and Supabase (PostgreSQL). Supabase is the primary production database with rich relational queries.
- **Media Integration**: Custom hooks handle external API calls for audio pronunciation and image fetching
- **Lesson System**: IELTS vocabulary is organized into lessons for structured learning progression
- **IPA Phonetics**: Support for International Phonetic Alphabet transcription for pronunciation learning

### Security Considerations
- No authentication system currently implemented
- API keys for external services should be moved server-side
- Input validation needed for API endpoints