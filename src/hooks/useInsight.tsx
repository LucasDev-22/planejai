import { useCallback, useEffect, useState } from 'react'

import { buildAIPrompt } from '@/data/aiPrompt'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getInsight, type InsightData } from '@/services/aiService'
import { useAsyncAction } from '@/hooks/useAsyncAction'

export const useInsight = (id: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()

  // 1. Hidratação síncrona do cache (memória inicial)
  const [cachedInsight] = useState<InsightData | null>(() => {
    return getFormData(id)?.insight || null
  })

  // 2. Isolamento da lógica de domínio e I/O
  const generateAndSave = useCallback(
    async (simulationId: string) => {
      const simulation = getFormData(simulationId)
      if (!simulation) throw new Error('Simulação não encontrada.')

      const prompt = buildAIPrompt(simulation)
      const data = await getInsight(prompt)

      updateSimulation(simulationId, {
        ...simulation,
        insight: data,
      } as SimulationRecord)

      return data
    },
    [getFormData, updateSimulation],
  )

  // 3. Delegação do controle de concorrência para a abstração global
  const { data, isLoading, error, execute } = useAsyncAction(generateAndSave)

  // 4. Orquestração
  useEffect(() => {
    // Só aciona a API se não houver cache e a requisição ainda não estiver em andamento
    if (!cachedInsight && !data && !isLoading && !error) {
      execute(id)
    }
  }, [id, cachedInsight, data, isLoading, error, execute])

  return {
    insight: data || cachedInsight, // Prioriza o dado fresco, faz fallback pro cache
    isLoading,
    error: error?.message || null,
    fetchInsight: () => execute(id),
  }
}
