import { useEffect, useState } from 'react'

const STORAGE_KEY = 'recipehub-theme'

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'recipelight'
    return localStorage.getItem(STORAGE_KEY) || 'recipelight'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'recipelight' ? 'recipedark' : 'recipelight'))
  }

  return { theme, toggleTheme }
}
