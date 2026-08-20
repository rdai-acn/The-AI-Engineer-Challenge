'use client'

import { useEffect, useRef, useState } from 'react'
import type { Message } from '@/lib/chat-types'
import { MessageBubble, TypingBubble } from './message-bubble'
import { Composer } from './composer'

const SUGGESTIONS = [
  'Write me a haiku about spring rain',
  'Capture the stillness of dawn',
  'A haiku for autumn leaves falling',
  'The ocean at night in three lines',
]

function createId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const hasStarted = messages.length > 0

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  async function sendMessage(content: string) {
    setError(null)
    const userMessage: Message = { id: createId(), role: 'user', content }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorMessages: Record<string, string> = {
          backend_down: 'The backend server is not running. Start the FastAPI server to continue.',
          llm_unavailable: 'The AI model provider is unreachable. Qwen3.5 is a locally run model and cannot be reached remotely.',
        }
        throw new Error(errorMessages[data?.errorCode] ?? data?.error ?? 'Something went wrong.')
      }

      setMessages((prev) => [
        ...prev,
        { id: createId(), role: 'assistant', content: data.reply || '…' },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-4 py-8">
          {!hasStarted ? (
            <EmptyState onPick={sendMessage} />
          ) : (
            <div className="flex flex-col gap-5">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && <TypingBubble />}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background/80 px-4 py-4 backdrop-blur-sm">
        <Composer onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}

function EmptyState({ onPick }: { onPick: (message: string) => void }) {
  return (
    <div className="flex flex-col items-center pt-10 text-center sm:pt-20">
      <span
        className="size-12 rotate-45 rounded-full border-[3px] border-accent border-r-transparent"
        aria-hidden="true"
      />
      <h1 className="mt-6 font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl">
        Speak your mind. Receive a verse.
      </h1>
      <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
        Whatever weighs on you, offer it in a line or two. Your companion answers only in haiku —
        three quiet lines to reflect on.
      </p>

      <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-lg border border-border bg-card px-4 py-3.5 text-left font-serif text-[0.95rem] text-card-foreground transition-colors hover:border-accent/50 hover:bg-secondary"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
