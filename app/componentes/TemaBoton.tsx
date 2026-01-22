'use client'
import { useTheme } from 'next-themes'

export function TemaBoton() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed right-4 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors z-50 text-2xl"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
