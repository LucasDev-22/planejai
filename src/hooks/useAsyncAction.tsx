import { useState, useCallback, useRef, useEffect } from 'react'

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

export const useAsyncAction = <T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>,
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  // Mutex lock para prevenir chamadas simultâneas (concorrência)
  const isExecuting = useRef(false)

  // Flag para rastrear se o componente ainda existe na árvore do DOM
  const isMounted = useRef(true)

  useEffect(() => {
    // Garante que a flag seja verdadeira a cada (re)montagem, contornando o Strict Mode
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      if (isExecuting.current) {
        console.warn(
          'Operação assíncrona bloqueada: já existe uma requisição em andamento.',
        )
        return
      }

      isExecuting.current = true
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const result = await asyncFn(...args)

        if (isMounted.current) {
          setState({ data: result, isLoading: false, error: null })
        }

        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))

        if (isMounted.current) {
          setState((prev) => ({ ...prev, isLoading: false, error }))
        }

        // Repassa o erro caso o componente que chamou precise executar lógicas específicas
        throw error
      } finally {
        isExecuting.current = false
      }
    },
    [asyncFn],
  )

  return { ...state, execute }
}
