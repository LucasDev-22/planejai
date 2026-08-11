import { useState, useCallback, useEffect } from 'react'

import type { ChatMessage, SimulationRecord } from '@/data/simulation'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { sendChatMessage } from '@/services/aiService'

export const useChat = (simulationId: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()
  const chatAction = useAsyncAction(sendChatMessage)

  // Sincroniza o estado inicial com o disco
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return getFormData(simulationId)?.chatHistory || []
  })

  // Evita stale closures (dados fantasmas) relendo o id caso a navegação mude
  useEffect(() => {
    setMessages(getFormData(simulationId)?.chatHistory || [])
  }, [simulationId])

  const sendMessage = useCallback(
    async (text: string) => {
      const currentSimulation = getFormData(simulationId)
      
      if (!text.trim() || !currentSimulation) return

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString(),
      }

      // Snapshot do histórico ANTES da nova mensagem (o aiService faz o append para a API)
      const previousHistory = currentSimulation.chatHistory || []
      const optimisticHistory = [...previousHistory, userMessage]

      // 1. Atualização Otimista na UI e no Storage
      setMessages(optimisticHistory)
      updateSimulation(simulationId, {
        ...currentSimulation,
        chatHistory: optimisticHistory,
      } as SimulationRecord)

      try {
        // 2. Disparo da requisição (I/O)
        const aiResponseText = await chatAction.execute(
          text.trim(),
          previousHistory,
          currentSimulation
        )

        if (!aiResponseText) throw new Error('Resposta vazia da inteligência artificial.')

        const modelMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'model',
          content: aiResponseText,
          timestamp: new Date().toISOString(),
        }

        const finalHistory = [...optimisticHistory, modelMessage]

        // 3. Persistência Final (Em caso de SUCESSO)
        setMessages(finalHistory)
        updateSimulation(simulationId, {
          ...currentSimulation,
          chatHistory: finalHistory,
        } as SimulationRecord)
        
      } catch (error) {
        console.error('Falha na orquestração do chat:', error)
        
        // 4. Rollback Transacional (Em caso de FALHA)
        // Remove a mensagem órfã da UI e do cache local para não corromper o array da API
        setMessages(previousHistory)
        updateSimulation(simulationId, {
          ...currentSimulation,
          chatHistory: previousHistory,
        } as SimulationRecord)
      }
    },
    [simulationId, getFormData, updateSimulation, chatAction]
  )

  return {
    messages,
    sendMessage,
    isLoading: chatAction.isLoading,
    error: chatAction.error,
  }
}