import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import type { SimulationRecord } from '@/data/simulation'

export const HistoryPage = () => {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()

  const [simulations, setSimulations] = useState<SimulationRecord[]>([])

  useEffect(() => {
    const savedSimulations = getAllSimulations()
    setSimulations(savedSimulations)
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Histórico de Simulações
      </h1>

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
              className="rounded-xl border p-5 shadow-sm"
            >
              <h2 className="mb-4 text-xl font-semibold">
                {simulation.goalName}
              </h2>

              <div className="grid gap-2 sm:grid-cols-3">
                <p>
                  <strong>Renda:</strong> {simulation.income}
                </p>

                <p>
                  <strong>Custos:</strong> {simulation.expenses}
                </p>

                <p>
                  <strong>Dívidas:</strong> {simulation.debts}
                </p>

                <p>
                  <strong>Meta:</strong> {simulation.goalAmount}
                </p>

                <p>
                  <strong>Prazo:</strong> {simulation.goalDeadline} meses
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/resultado/${simulation.id}`}
                  className="cursor-pointer rounded-lg border px-4 py-2 font-medium transition duration-150 hover:bg-gray-100 active:scale-95"
                >
                  Ver detalhes
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    deleteSimulation(simulation.id)
                    setSimulations(getAllSimulations())
                  }}
                  className="cursor-pointer rounded-lg border px-4 py-2 font-medium transition duration-150 hover:bg-gray-100 active:scale-95"
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}