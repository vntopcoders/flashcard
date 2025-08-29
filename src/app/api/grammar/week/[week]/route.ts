import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ week: string }> }
) {
  try {
    const { week } = await params
    const weekNumber = parseInt(week)
    
    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 24) {
      return NextResponse.json({ error: 'Invalid week number' }, { status: 400 })
    }

    // Get grammar topics for the week
    const { data: topics, error: topicsError } = await supabase
      .from('grammar_topics')
      .select('*')
      .eq('week_number', weekNumber)
      .order('order_index')

    if (topicsError) {
      console.error('Topics error:', topicsError)
      return NextResponse.json({ error: 'Failed to fetch grammar topics' }, { status: 500 })
    }

    // Get key points for each topic
    const topicsWithPoints = await Promise.all(
      topics.map(async (topic) => {
        const { data: keyPoints, error: pointsError } = await supabase
          .from('grammar_key_points')
          .select('*')
          .eq('grammar_topic_id', topic.id)
          .order('order_index')

        if (pointsError) {
          console.error('Key points error:', pointsError)
          return { ...topic, keyPoints: [] }
        }

        return { ...topic, keyPoints }
      })
    )

    // Get study resources for the week
    const { data: resources, error: resourcesError } = await supabase
      .from('study_resources')
      .select('*')
      .eq('week_number', weekNumber)
      .order('resource_type, order_index')

    if (resourcesError) {
      console.error('Resources error:', resourcesError)
    }

    // Group resources by type
    const groupedResources = resources?.reduce((acc, resource) => {
      const type = resource.resource_type
      if (!acc[type]) acc[type] = []
      acc[type].push(resource)
      return acc
    }, {} as Record<string, any[]>) || {}

    return NextResponse.json({
      success: true,
      data: {
        weekNumber,
        topics: topicsWithPoints,
        resources: groupedResources,
        lessonLinks: groupedResources.lesson?.map((r: any) => r.url) || [],
        grammarLinks: groupedResources.grammar?.map((r: any) => r.url) || []
      }
    })
  } catch (error) {
    console.error('Grammar API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}