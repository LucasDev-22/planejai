import { Loader2, MessageCircle, Send } from 'lucide-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'

import { useChat } from '@/hooks/useChat'
import type { InsightData } from '@/services/aiService'

import { Content } from '../Insights/Content'

interface ChatThreadProps {
  simulationId: string
  insight: InsightData
}

export function ChatThread({ simulationId, insight }: ChatThreadProps) {
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Desacoplamento da lógica de rede e estado local
  const { messages, sendMessage, isLoading, error } = useChat(simulationId)

  // Efeito colateral para manter o scroll ancorado na última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || isLoading) return

    const textToSubmit = inputText
    // Limpeza otimista do input para melhor percepção de latência
    setInputText('')
    await sendMessage(textToSubmit)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-thin flex-1 overflow-y-auto px-6 pb-2 [scrollbar-color:var(--border)_transparent]">
        <Content insight={insight} />

        {messages.length > 0 && (
          <div className="border-border mt-5 flex flex-col gap-4 border-t pt-5">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-1">
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <MessageCircle size={14} />
                  {msg.role === 'user' ? 'Você' : 'Resposta da IA'}
                </div>
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            ))}

            {isLoading && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 size={16} className="animate-spin" />
                Analisando...
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="border-border bg-card mt-2 flex shrink-0 items-center gap-2 border-t px-6 py-4"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Quais são os investimentos mais seguros que posso usar..."
          className="bg-input text-foreground placeholder:text-muted-foreground flex-1 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-600/50 disabled:opacity-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:opacity-90 disabled:opacity-50 disabled:hover:opacity-50"
          aria-label="Enviar mensagem"
        >
          <Send size={18} className="ml-0.5" />
        </button>
      </form>
    </div>
  )
}
