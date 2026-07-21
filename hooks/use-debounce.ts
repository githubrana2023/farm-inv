import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay?: number): { debouncedValue: T, isLoading: boolean } {
  const [state, setState] = useState({
    debouncedValue: value, isLoading: false
  })

  useEffect(() => {
    setState(prev => ({ ...state, isLoading: true }))
    const handler = setTimeout(
      () => {
        setState(prev => ({ ...state, debouncedValue: value, isLoading: false }))
      }
      , delay || 500
    )

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return state
}