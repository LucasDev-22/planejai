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

      {(isLoading || error) && (
        <div className="p-6">
          <div className="mb-1 flex items-center gap-1.5">
            <span>✨</span>
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
              Insight Financeiro Personalizado
            </span>
          </div>
          <h2 className="text-foreground mb-4 text-xl font-semibold sm:text-2xl">
            Plano de Ação: {goalName}
          </h2>

          {isLoading && (
            <div className="flex">
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
            <Error
              simulationId={simulationId}
              message={error}
              onRetry={() => fetchInsight(simulationId)}
            />
          )}
        </div>
      )}

      {/* 
        Delega toda a responsabilidade visual restante ao ChatThread.
        Lembre-se: o ChatThread precisará englobar o "Insight Financeiro Personalizado" e a renderização do markdown para que ambos rolem juntos.
      */}
      {!isLoading && insight && !error && (
        <ChatThread simulationId={simulationId} insight={insight} />
      )}
    </div>
  )
}