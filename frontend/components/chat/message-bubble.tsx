import { cn } from '@/lib/utils'
import type { Message } from '@/lib/chat-types'

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex w-full justify-end duration-500 animate-in fade-in slide-in-from-bottom-2">
        <div className="max-w-[80%] whitespace-pre-wrap text-pretty rounded-2xl rounded-br-sm bg-secondary px-4 py-2.5 text-[0.9375rem] leading-relaxed text-secondary-foreground sm:max-w-[70%]">
          {message.content}
        </div>
      </div>
    )
  }

  return <HaikuVerse content={message.content} />
}

function HaikuVerse({ content }: { content: string }) {
  // The model may chain multiple haiku, separated by blank lines. Split into
  // stanzas so each is rendered as its own three-line verse.
  const stanzas = content
    .split(/\n\s*\n/)
    .map((stanza) =>
      stanza
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0)

  return (
    <figure className="my-2 flex flex-col items-center py-6 text-center duration-700 animate-in fade-in slide-in-from-bottom-1">
      {/* ensō mark */}
      <span
        className="mb-5 size-6 rotate-45 rounded-full border-2 border-accent border-r-transparent"
        aria-hidden="true"
      />
      <blockquote className="flex flex-col gap-6 font-serif text-xl leading-[1.9] tracking-tight text-foreground text-balance sm:text-[1.6rem]">
        {stanzas.map((lines, s) => (
          <span key={s} className="block">
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </span>
        ))}
      </blockquote>
      <figcaption className="mt-5 h-px w-10 bg-border" aria-hidden="true" />
    </figure>
  )
}

export function TypingBubble() {
  return (
    <div className="flex flex-col items-center py-8" aria-live="polite">
      <span className="sr-only">Composing a verse</span>
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-accent/70"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
      <p className="mt-3 font-serif text-sm italic text-muted-foreground">brushing ink…</p>
    </div>
  )
}
