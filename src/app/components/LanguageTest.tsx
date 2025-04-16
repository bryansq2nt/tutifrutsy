'use client'

import { useLanguage } from '../context/LanguageContext'
import { useEffect, useState } from 'react'

export default function LanguageTest() {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('LanguageTest mounted, language:', language)
  }, [language])

  if (!mounted) {
    return <div>Loading language test...</div>
  }

  return (
    <div className="p-4 border border-red-500 m-4">
      <h2 className="text-xl font-bold mb-2">Language Test Component</h2>
      <p>Current language: <strong>{language}</strong></p>
      <div className="mt-4">
        <button 
          onClick={() => setLanguage('en')}
          className="px-3 py-1 bg-blue-500 text-white mr-2 rounded"
        >
          Set English
        </button>
        <button 
          onClick={() => setLanguage('es')}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Set Spanish
        </button>
      </div>
      <div className="mt-4">
        <p>English text: <span className="font-bold">Hello World</span></p>
        <p>Spanish text: <span className="font-bold">Hola Mundo</span></p>
      </div>
    </div>
  )
} 