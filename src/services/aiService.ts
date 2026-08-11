import type { ChatMessage, SimulationRecord } from '@/data/simulation'

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

/**
 * Cliente HTTP base para requisições na API do Gemini
 */
const callGeminiAPI = async (payload: object) => {
  if (!API_KEY || API_KEY === 'undefined') {
    throw new Error('Chave de API do Gemini não configurada.')
  }

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Erro na comunicação com a IA: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

/**
 * Gera o diagnóstico estruturado inicial (JSON)
 */
export const getInsight = async (prompt: string): Promise<InsightData> => {
  const response = await callGeminiAPI({
    contents: [{ parts: [{ text: prompt }] }],
  })

  const rawText = response.candidates[0]?.content?.parts[0]?.text

  if (!rawText) {
    throw new Error('Resposta inválida recebida da inteligência artificial.')
  }

  return JSON.parse(rawText) as InsightData
}

/**
 * Envia uma nova mensagem no chat mantendo o contexto histórico da simulação
 */
export const sendChatMessage = async (
  newMessage: string,
  history: ChatMessage[],
  simulation: SimulationRecord,
): Promise<string> => {
  // 1. Injeção de Contexto do Educador Financeiro
  const systemInstruction = {
    parts: [
      {
        text: `Você é um Educador Financeiro Pessoal Inteligente.
O usuário está consultando a seguinte simulação:
- Objetivo: ${simulation.goalName} (Meta: R$ ${simulation.goalAmount}, Prazo: ${simulation.goalDeadline} meses)
- Renda Mensal: R$ ${simulation.income}
- Custos Fixos: R$ ${simulation.expenses}
- Dívidas: R$ ${simulation.debts}

Forneça respostas claras, objetivas, analíticas e empáticas. Foque em educação financeira prática.
Responda sempre em texto corrido, sem usar markdown (sem **negrito**, sem títulos, sem listas com asteriscos ou hífens).`,
      },
    ],
  }

  // 2. Mapeamento do histórico para o formato do Gemini (user/model)
  const formattedHistory = history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }))

  // 3. Adiciona a nova mensagem do usuário no final do histórico
  const contents = [
    ...formattedHistory,
    {
      role: 'user',
      parts: [{ text: newMessage }],
    },
  ]

  // 4. Execução da chamada HTTP
  const response = await callGeminiAPI({
    systemInstruction,
    contents,
  })

  const responseText = response.candidates[0]?.content?.parts[0]?.text

  if (!responseText) {
    throw new Error('A inteligência artificial não retornou texto.')
  }

  return responseText
}
