'use client'

import { useLanguage } from '../context/LanguageContext'

export default function ClientLanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1 rounded-md ${
          language === 'es'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md ${
          language === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  )
} 