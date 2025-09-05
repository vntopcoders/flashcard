import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('Updating transcript for test 1...')

    const newTranscript = `Part 1: Conversation - Photography Course Enrollment
Receptionist: Good morning, Community Learning Center. How can I help you?
Sarah: Hello, I'm calling about the photography classes. I saw your advertisement in the local newspaper.
Receptionist: Oh yes, our photography course. Are you a complete beginner?
Sarah: Well, I have a basic camera, but I really don't know how to use it properly. I'd like to learn the fundamentals.
Receptionist: Perfect. Our beginner's course starts next Monday. It runs for six weeks, every Monday from 7 to 9 PM.
Sarah: That sounds ideal. How much does it cost?
Receptionist: The course fee is 150 pounds, and that includes all materials and handouts.

Part 2: Monologue - National Botanical Gardens Tour
Good morning, and welcome to the National Botanical Gardens. I'm David Thompson, and I'll be your guide today. The National Botanical Gardens covers 85 hectares and houses over 12,000 different plant species from around the world. We're open every day from 9 AM to 6 PM, except on Christmas Day.

Part 3: Academic Discussion - Research Methods
Student A: I'm really struggling with choosing the right research method for our project.
Professor: Well, let's think about what you're trying to investigate. Are you looking at quantitative or qualitative data?
Student B: We want to understand student attitudes toward social media, so I think qualitative would be better.
Professor: That's a good start. You could use surveys for quantitative data and interviews for deeper insights.

Part 4: Academic Lecture - Archaeological Dating Methods  
Today we'll examine various dating techniques used in archaeology. Carbon dating can measure objects up to 50,000 years old. For more recent artifacts, dendrochronology is often the most accurate method. The advantage of mass spectrometry is that it works on very small samples.`

    // Update test 1
    const { data: test1, error: error1 } = await supabase
      .from('listening_tests')
      .update({ 
        audio_transcript: newTranscript,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()

    if (error1) {
      console.error('Error updating test 1:', error1)
      return NextResponse.json({ error: 'Failed to update test 1', details: error1 }, { status: 500 })
    }

    console.log('Successfully updated test 1')

    return NextResponse.json({
      success: true,
      message: 'Transcript updated successfully',
      updated: test1
    })

  } catch (error) {
    console.error('Update transcript error:', error)
    return NextResponse.json({
      error: 'Failed to update transcript',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET - Check current transcript
export async function GET() {
  try {
    const { data: test, error } = await supabase
      .from('listening_tests')
      .select('id, title, audio_transcript')
      .eq('id', 1)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to get test', details: error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      test: test,
      transcriptLength: test.audio_transcript?.length || 0
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check transcript',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}