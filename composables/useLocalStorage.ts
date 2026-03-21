export const useLocalStorage = () => {
  const get = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  const set = <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
    }
  }

  const remove = (key: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  }

  const clear = (): void => {
    if (typeof window === 'undefined') return
    localStorage.clear()
  }

  return {
    get,
    set,
    remove,
    clear
  }
}
