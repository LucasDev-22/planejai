import {
  type SimulationFormData,
  type SimulationRecord,
} from '@/data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

export const useSimulationStorage = () => {
  const readData = (): SimulationRecord[] => {
    try {
      const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (!storage) return []

      const parsed = JSON.parse(storage)

      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('Erro ao ler ou parsear o localStorage:', error)
      return []
    }
  }

  const writeData = (data: SimulationRecord[]): void => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error)
    }
  }

  const saveFormData = (formData: SimulationFormData): string => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = { ...formData, id }
    const savedData = readData()

    writeData([...savedData, record])
    return id
  }

  const getFormData = (id: string): SimulationRecord | null => {
    const savedData = readData()
    return savedData.find((record) => record.id === id) || null
  }

  const updateSimulation = (id: string, data: SimulationRecord): void => {
    const savedData = readData()
    const updated = savedData.map((record) =>
      record.id === id ? { ...data } : record,
    )
    writeData(updated)
  }

  const deleteSimulation = (id: string): void => {
    const savedData = readData()
    const updated = savedData.filter((record) => record.id !== id)
    writeData(updated)
  }

  const getAllSimulations = (): SimulationRecord[] => {
    return readData()
  }

  return {
    saveFormData,
    getFormData,
    updateSimulation,
    getAllSimulations,
    deleteSimulation,
  }
}
