import { useEffect, useState } from 'react'

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState(() => {
    const localData = localStorage.getItem(key)
    if (localData) {
      try {
        return JSON.parse(localData) as T
      } catch (_e) {
        /* empty */
      }
    }
    return defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
