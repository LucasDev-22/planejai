import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from 'react-loading-skeleton'

import { useInsight } from '@/hooks/useInsight'

import { ChatThread } from '../Chat/ChatThread'
import { Error } from '../Insights/Error'

interface AIInsightCardProps {
  simulationId: string
  goalName: string
}

export function AIInsightsCard({ simulationId, goalName }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)

  return (
    <div className="bg-card order-2 flex h-[600px] max-h-[75vh] w-full flex-col overflow-hidden rounded-2xl shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="shrink-0 px-6 pt-6 pb-2">
        <div className="mb-1 flex items-center gap-1.5">
          <span>✨</span>
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Insight Financeiro Personalizado
          </span>
        </div>
        <h2 className="text-foreground text-xl font-semibold sm:text-2xl">
          Plano de Ação: {goalName}
        </h2>
      </div>

      {/* Estados Assíncronos */}
      {isLoading && (
        <div className="flex px-6 pb-6">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}

      {!isLoading && error && (
        <div className="px-6 pb-6">
          <Error
            simulationId={simulationId}
            message={error}
            onRetry={() => fetchInsight(simulationId)}
          />
        </div>
      )}

      {/* Renderização do Chat */}
      {!isLoading && insight && !error && (
        <ChatThread simulationId={simulationId} insight={insight} />
      )}
    </div>
  )
}
