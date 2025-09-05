import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'en-US', rate = 1.0 } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Create a simple TTS instruction for the frontend
    // This doesn't generate actual audio file but provides instruction for Web Speech API
    const ttsInstruction = {
      success: true,
      audioContent: null, // No base64 audio, will use Web Speech API
      instruction: {
        text: text,
        lang: voice,
        rate: rate,
        pitch: 0,
        volume: 1
      },
      duration: Math.ceil(text.length * 0.08), // Estimate duration
      message: 'Use Web Speech API for TTS'
    }

    return NextResponse.json(ttsInstruction)

  } catch (error) {
    console.error('TTS instruction error:', error)
    return NextResponse.json({
      error: 'Failed to create TTS instruction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET - Check TTS service status
export async function GET() {
  return NextResponse.json({
    service: 'Web Speech TTS Service',
    status: 'Available',
    features: [
      'No API key required',
      'Uses browser Web Speech API',
      'Multiple language support',
      'Real-time audio generation'
    ],
    supported: typeof window !== 'undefined' && 'speechSynthesis' in window
  })
}