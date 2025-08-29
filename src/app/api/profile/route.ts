import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile from next_auth.users table
    const { data: user, error: userError } = await supabase
      .from('next_auth.users')
      .select(`
        id,
        name,
        email,
        image,
        created_at,
        updated_at,
        current_level,
        target_band_score,
        study_streak,
        total_study_time,
        preferred_study_time,
        timezone
      `)
      .eq('email', session.user.email)
      .single()

    if (userError) {
      console.error('User fetch error:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('next_auth.user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (prefsError) {
      console.warn('Preferences fetch error:', prefsError)
      // Create default preferences if they don't exist
      const { data: newPrefs } = await supabase
        .from('next_auth.user_preferences')
        .insert({ user_id: user.id })
        .select('*')
        .single()
      
      return NextResponse.json({
        user,
        preferences: newPrefs || {}
      })
    }

    return NextResponse.json({
      user,
      preferences
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { user: userUpdates, preferences: prefUpdates } = body

    // Get current user ID
    const { data: currentUser } = await supabase
      .from('next_auth.users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user profile if provided
    if (userUpdates) {
      const allowedUserFields = [
        'current_level',
        'target_band_score', 
        'study_streak',
        'total_study_time',
        'preferred_study_time',
        'timezone'
      ]

      const filteredUpdates = Object.keys(userUpdates)
        .filter(key => allowedUserFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = userUpdates[key]
          return obj
        }, {} as Record<string, unknown>)

      if (Object.keys(filteredUpdates).length > 0) {
        const { error: userUpdateError } = await supabase
          .from('next_auth.users')
          .update(filteredUpdates)
          .eq('id', currentUser.id)

        if (userUpdateError) {
          console.error('User update error:', userUpdateError)
          return NextResponse.json(
            { error: 'Failed to update user profile' },
            { status: 500 }
          )
        }
      }
    }

    // Update preferences if provided
    if (prefUpdates) {
      const allowedPrefFields = [
        'preferred_accent',
        'auto_play',
        'playback_speed',
        'volume',
        'enable_offline_cache',
        'daily_word_target',
        'reminder_enabled',
        'reminder_time',
        'show_ipa',
        'dark_mode',
        'language_interface'
      ]

      const filteredPrefUpdates = Object.keys(prefUpdates)
        .filter(key => allowedPrefFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = prefUpdates[key]
          return obj
        }, {} as Record<string, unknown>)

      if (Object.keys(filteredPrefUpdates).length > 0) {
        const { error: prefUpdateError } = await supabase
          .from('next_auth.user_preferences')
          .update(filteredPrefUpdates)
          .eq('user_id', currentUser.id)

        if (prefUpdateError) {
          console.error('Preferences update error:', prefUpdateError)
          return NextResponse.json(
            { error: 'Failed to update preferences' },
            { status: 500 }
          )
        }
      }
    }

    // Fetch updated profile
    const { data: updatedUser } = await supabase
      .from('next_auth.users')
      .select('*')
      .eq('id', currentUser.id)
      .single()

    const { data: updatedPreferences } = await supabase
      .from('next_auth.user_preferences')
      .select('*')
      .eq('user_id', currentUser.id)
      .single()

    return NextResponse.json({
      user: updatedUser,
      preferences: updatedPreferences
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}