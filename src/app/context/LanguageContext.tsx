'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  // Load language preference from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        console.log('Loading saved language:', savedLanguage)
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }
    setMounted(true)
  }, [])

  // Save language preference to localStorage when it changes
  const handleLanguageChange = (lang: Language) => {
    console.log('Changing language to:', lang)
    setLanguage(lang)
    try {
      localStorage.setItem('language', lang)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  // Only render children after component is mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 