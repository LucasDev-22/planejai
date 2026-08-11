import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

import { useChat } from '@/hooks/useChat'

interface ChatWidgetProps {
  simulationId: string
}

export function ChatWidget({ simulationId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Desacoplamento da lógica de rede e estado local
  const { messages, sendMessage, isLoading, error } = useChat(simulationId)

  // Efeito colateral para manter o scroll ancorado na última mensagem
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || isLoading) return

    const textToSubmit = inputText
    // Limpeza otimista do input para melhor percepção de latência
    setInputText('')
    await sendMessage(textToSubmit)
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end sm:right-6 sm:bottom-6">
      {/* 
        Container do Chat 
        Responsividade: Usa calc() para não vazar a tela em dispositivos móveis e limita a altura a 80vh
      */}
      {isOpen && (
        <div className="mb-4 flex h-[80vh] max-h-[600px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all sm:h-[500px] sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between bg-violet-600 p-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="font-semibold">Assistente Planej.ai</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition-colors hover:bg-violet-700 hover:text-violet-200"
              aria-label="Fechar chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <div className="flex flex-col gap-3">
              {/* Fallback caso não haja histórico */}
              {messages.length === 0 && (
                <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm border border-gray-100 bg-white p-3 text-sm text-gray-700 shadow-sm">
                  Olá! Como posso ajudar com os números da sua simulação hoje?
                </div>
              )}

              {/* Mapeamento Bidirecional de Histórico */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-wrap shadow-sm ${
                    msg.role === 'user'
                      ? 'ml-auto rounded-tr-sm bg-violet-600 text-white'
                      : 'mr-auto rounded-tl-sm border border-gray-100 bg-white text-gray-700'
                  }`}
                >
                  {msg.content}
                </div>
              ))}

              {/* Indicador de Digitação / I/O Blocking */}
              {isLoading && (
                <div className="mr-auto flex max-w-[85%] items-center gap-2 rounded-2xl rounded-tl-sm border border-gray-100 bg-white p-3 text-sm text-gray-500 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-violet-600" />
                  Analisando...
                </div>
              )}

              {/* Tratamento e Exibição de Falhas de Rede */}
              {error && (
                <div className="mx-auto mt-2 rounded-lg bg-red-50 p-2 text-center text-xs text-red-600">
                  {error.message}
                </div>
              )}

              {/* Âncora invisível para o IntersectionObserver/Scroll */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-violet-600/50 disabled:opacity-50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition-colors hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600"
            >
              <Send size={18} className="ml-1" />
            </button>
          </form>
        </div>
      )}

      {/* FAB (Floating Action Button) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-violet-700"
          aria-label="Abrir assistente"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  )
}
