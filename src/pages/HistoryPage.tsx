import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import type { SimulationRecord } from '@/data/simulation'

export const HistoryPage = () => {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()

  const [simulations, setSimulations] = useState<SimulationRecord[]>([])

  const [simulationToDelete, setSimulationToDelete] =
    useState<SimulationRecord | null>(null)

  useEffect(() => {
    const savedSimulations = getAllSimulations()
    setSimulations(savedSimulations)
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Histórico de Simulações</h1>

      {simulations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border p-10 text-center">
          <h2 className="text-xl font-semibold">
            Nenhuma simulação encontrada
          </h2>

          <p className="mt-2 text-gray-500">
            Crie uma simulação para começar a acompanhar seus objetivos
            financeiros.
          </p>

          <Link
            to="/"
            className="mt-6 cursor-pointer rounded-lg border px-4 py-2 font-medium transition duration-150 hover:bg-gray-100 active:scale-95"
          >
            Nova simulação
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {simulations.map((simulation) => (
            <article
              key={simulation.id}
              className="flex flex-col rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {simulation.goalName}
                </h2>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                <div className="flex flex-col">
                  <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Renda
                  </span>
                  <span className="mt-1 font-semibold text-gray-900">
                    {simulation.income}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Custos
                  </span>
                  <span className="mt-1 font-semibold text-gray-900">
                    {simulation.expenses}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Dívidas
                  </span>
                  <span className="mt-1 font-semibold text-gray-900">
                    {simulation.debts}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Meta
                  </span>
                  <span className="mt-1 font-semibold text-gray-900">
                    {simulation.goalAmount}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Prazo
                  </span>
                  <span className="mt-1 font-semibold text-gray-900">
                    {simulation.goalDeadline} meses
                  </span>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSimulationToDelete(simulation)}
                  className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 active:scale-95"
                >
                  Excluir
                </button>

                <Link
                  to={`/resultado/${simulation.id}`}
                  className="cursor-pointer rounded-lg bg-violet-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-violet-600 active:scale-95"
                >
                  Ver detalhes
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {simulationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Excluir simulação?</h2>

            <p className="mt-2 text-gray-500">
              Tem certeza que deseja excluir a simulação de{' '}
              <strong>{simulationToDelete.goalName}</strong>? Essa ação não
              poderá ser desfeita.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSimulationToDelete(null)}
                className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 active:scale-95"
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
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-red-700 active:scale-95"
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
