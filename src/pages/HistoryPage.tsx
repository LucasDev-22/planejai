import { ExternalLink, Target, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export const HistoryPage = () => {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()

  const [simulations, setSimulations] = useState<SimulationRecord[]>([])
  const [simulationToDelete, setSimulationToDelete] = useState<SimulationRecord | null>(null)

  useEffect(() => {
    const savedSimulations = getAllSimulations()
    setSimulations(savedSimulations)
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-foreground mb-1 text-3xl font-bold">Histórico de simulações</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Acompanhe o histórico de seus planos financeiros.
      </p>

      {simulations.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-2xl border p-10 text-center shadow-sm">
          <h2 className="text-foreground text-xl font-semibold">
            Nenhuma simulação encontrada
          </h2>
          <p className="text-muted-foreground mt-2">
            Crie uma simulação para começar a acompanhar seus objetivos financeiros.
          </p>
          <Link
            to="/"
            className="bg-primary text-primary-foreground mt-6 cursor-pointer rounded-xl px-5 py-2.5 font-medium shadow-sm transition duration-150 hover:opacity-90 active:scale-95"
          >
            Nova simulação
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {simulations.map((simulation) => (
            <article
              key={simulation.id}
              className="bg-card border-border flex flex-col rounded-2xl border p-5 shadow-sm transition-all md:flex-row md:items-center md:justify-between md:gap-6 md:p-6"
            >
              {/* Seção Esquerda: Ícone e Título */}
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-semibold">{simulation.goalName}</h3>
                  <span className="text-muted-foreground text-xs">Simulação salva</span>
                </div>
              </div>

              {/* Seção Central: Métricas (Custo, Prazo, Renda) */}
              <div className="border-border my-4 grid grid-cols-3 gap-2 border-y py-4 md:my-0 md:flex md:items-center md:gap-8 md:border-0 md:py-0">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                    Custo da Meta
                  </span>
                  <span className="text-foreground mt-1 text-sm font-semibold">
                    {simulation.goalAmount}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                    Prazo
                  </span>
                  <span className="text-foreground mt-1 text-sm font-semibold">
                    {simulation.goalDeadline} meses
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                    Renda Mensal
                  </span>
                  <span className="text-foreground mt-1 text-sm font-semibold">
                    {simulation.income}
                  </span>
                </div>
              </div>

              {/* Seção Direita: Ações (Lixeira e Ver Detalhes) */}
              <div className="border-border flex items-center justify-between border-t pt-4 md:justify-end md:gap-4 md:border-0 md:pt-0">
                <button
                  type="button"
                  onClick={() => setSimulationToDelete(simulation)}
                  className="text-muted-foreground hover:bg-muted cursor-pointer rounded-lg p-2 transition-colors hover:text-red-500 active:scale-95"
                  aria-label="Excluir simulação"
                >
                  <Trash2 size={20} />
                </button>

                <Link
                  to={`/resultado/${simulation.id}`}
                  className="border-border text-foreground hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-colors active:scale-95"
                >
                  <span>Ver detalhes</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal de Exclusão Adaptado para Dark Mode */}
      {simulationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="border-border bg-card w-full max-w-md rounded-2xl border p-6 shadow-xl">
            <h2 className="text-foreground text-xl font-semibold">Excluir simulação?</h2>
            
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Tem certeza que deseja excluir a simulação de{' '}
              <strong className="text-foreground">{simulationToDelete.goalName}</strong>? 
              Essa ação não poderá ser desfeita.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSimulationToDelete(null)}
                className="border-border text-foreground hover:bg-muted cursor-pointer rounded-xl border bg-transparent px-4 py-2 text-sm font-medium transition-colors duration-150 active:scale-95"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteSimulation(simulationToDelete.id)
                  setSimulations((prev) =>
                    prev.filter((sim) => sim.id !== simulationToDelete.id),
                  )
                  setSimulationToDelete(null)
                }}
                className="cursor-pointer rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-red-700 active:scale-95"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}