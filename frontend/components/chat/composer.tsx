'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ComposerProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function Composer({ onSend, disabled }: ComposerProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Respect IME composition (CJK input) before submitting on Enter.
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      submit()
    }
  }

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        className={cn(
          'flex items-end gap-2 rounded-3xl border border-border bg-card p-2 shadow-lg transition-shadow',
          'focus-within:ring-2 focus-within:ring-ring/40',
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            autoGrow(e.target)
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Offer a thought…"
          aria-label="Message"
          className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-[0.9375rem] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        />
        <Button
          type="button"
          size="icon"
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="size-10 shrink-0 rounded-full"
          aria-label="Send message"
        >
          <ArrowUp className="size-5" />
        </Button>
      </div>
      <p className="mt-2 px-2 text-center text-xs text-muted-foreground">
        Every reply arrives as a haiku — 5·7·5, three lines.
      </p>
    </div>
  )
}
