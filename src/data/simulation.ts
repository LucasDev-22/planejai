import type { InsightData } from '@/services/aiService'

export interface SimulationFormData {
  goalName: string
  income: string
  expenses: string
  debts: string
  goalAmount: string
  goalDeadline: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'model'
  content: string
  timestamp: string
}

export interface SimulationRecord extends SimulationFormData {
  id: string
  insight?: InsightData | null
  chatHistory?: ChatMessage[]
}
