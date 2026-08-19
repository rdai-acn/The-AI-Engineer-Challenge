import { ChatWindow } from '@/components/chat/chat-window'

export default function Page() {
  return (
    <main className="flex h-dvh flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2.5">
          <div
            className="size-6 rotate-45 rounded-full border-2 border-accent border-r-transparent"
            aria-hidden="true"
          />
          <div className="leading-tight">
            <p className="font-serif text-lg font-medium tracking-tight">Kigo</p>
            <p className="text-xs text-muted-foreground">A haiku companion</p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 font-serif text-xs italic text-muted-foreground sm:flex">
          replies in three lines
        </span>
      </header>

      <div className="min-h-0 flex-1">
        <ChatWindow />
      </div>
    </main>
  )
}
