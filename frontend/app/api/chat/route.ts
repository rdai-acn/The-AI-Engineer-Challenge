import { type NextRequest, NextResponse } from 'next/server'

export const maxDuration = 180 // seconds — needed for Vercel serverless

// Base URL of the FastAPI backend (the provided index.py service).
// Set CHAT_API_URL in your environment, e.g. https://your-backend.example.com
const BACKEND_URL = process.env.CHAT_API_URL ?? 'http://localhost:8000'

// The backend now owns the haiku behavior in its own system prompt
// ("a master haiku writer"), so we pass the user's message through untouched.

export async function POST(req: NextRequest) {
  let message: string

  try {
    const body = await req.json()
    message = typeof body?.message === 'string' ? body.message.trim() : ''
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!message) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      // Local LLM (e.g. LM Studio) can be slow; give it up to 3 minutes.
      signal: AbortSignal.timeout(180_000),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.log('[chat] Backend responded with error:', res.status, detail)
      // Backend is reachable but the LLM call failed — provider issue.
      return NextResponse.json({ errorCode: 'llm_unavailable' }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({ reply: data.reply ?? '' })
  } catch (error) {
    console.log('[chat] Failed to reach backend:', error instanceof Error ? error.message : error)
    // fetch() threw — backend is not up.
    return NextResponse.json({ errorCode: 'backend_down' }, { status: 502 })
  }
}
